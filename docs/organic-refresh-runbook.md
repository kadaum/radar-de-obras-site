# Refresh e rollback — Radar de Obras

## Estado e propriedade

O Site publica arquivos estáticos validados em `public/data/` para o mapa e páginas. A API Obrasgov é consultada sob demanda em `/api/detail`; quando ela falha para as dez fichas do piloto, a rota devolve o último detalhe validado com `fallbackEndpoints` e a data verdadeira do snapshot. Para IDs fora do piloto, a falha retorna 502 e o cartão do mapa mantém os campos do snapshot. Um campo indisponível não é tratado como ausência comprovada.

Não havia schedule cloud no Site visível ao owner em 24/09/2026. A automação semanal desta tarefa coordena a verificação por 90 dias e só publica um novo snapshot quando a carga da fonte mudou, a coleta terminou e todas as avaliações passaram. Ela deve ficar quieta sem mudança acionável. Não há um segundo agendamento de coleta no Site.

O primeiro passo da revisão semanal é `node scripts/check-organic-live.mjs`. Ele consulta, sem gravar dados, as 22 URLs canônicas, mapa, resumo agregado, `robots.txt`, sitemap, `llms.txt`, downloads e a data da carga oficial. A saída JSON distingue falhas de rota, inconsistência do resumo, indisponibilidade da fonte e uma nova carga que pede refresh. Uma falha temporária deve ser reavaliada antes de alterar o site. A prévia local pode ser verificada com `node scripts/check-organic-live.mjs http://127.0.0.1:3003`.

## Verificar fonte e produzir candidato

1. Confira `https://api-publica.obrasgov.gestao.gov.br/obras/data-atualizacao`. Compare com `meta.sourceLoad` em `public/data/projects-manifest.json`. Carga igual não exige republicar nem atualizar timestamps.
2. Quando a carga mudou, no checkout canônico do Site execute `node scripts/collect-map-snapshot.mjs`. O coletor consulta os endpoints oficiais `projeto-investimento` e `geometria`, páginas de 200, duas requisições simultâneas, intervalo mínimo de 180 ms e até cinco tentativas. Grava um candidato isolado em `.sites-runtime/organic-candidate-*`; não toca nos arquivos públicos. Pode demorar vários minutos.
3. Confira o `validation.json`: carga igual no início e fim, totais da API iguais aos recebidos, IDs únicos, nenhuma geometria órfã, SQLite íntegro e contagem exportada. Inspecione `failure.json` se existir. Falha mantém a publicação anterior, sem mudar datas.
4. Execute `node scripts/promote-map-snapshot.mjs <caminho-absoluto-do-candidato>` somente com candidato validado. O script reconfere todos os blocos e os dez IDs/municípios do piloto, move a versão anterior para `.sites-runtime/data-backup-*` e promove os novos dados. Se um projeto mudou de município ou desapareceu, revise seleção e conteúdo antes de publicar.
5. Execute `node scripts/build-organic-snapshot.mjs --refresh-details` para consultar as dez fichas por ID e regenerar o recorte, CSV e JSON. O gerador compara nome e UF da API com o snapshot e falha em divergência. Execute `node scripts/build-discovery-index.mjs` para atualizar sitemap e `llms.txt`. `npm run build` também regenera `public/data/map-overview.json` a partir dos blocos e recompila a fonte editável em `map-source/`.
6. Execute `npm run lint`, `npm run build`, `node --import tsx --test scripts/eval-fallback.test.mjs` e `node scripts/eval-organic.mjs <URL-da-prévia-local>`. Faça QA do mapa, ficha, cidade e deep link. Publique apenas pela sequência Sites, com commit e archive correspondentes, e verifique rotas em produção.

O coletor usa a malha do IBGE que acompanha o código em `scripts/source/data/brazil-boundary.json`, obtida da [API de Malhas do IBGE](https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=maxima). A malha simplificada faz triagem ampla; não certifica precisão do ponto. O cálculo geográfico foi preservado do código MIT do produto original.

## Quando a fonte falha ou muda de formato

Não promova candidato sem `validation.json` com status `validated`. Mantenha `public/data/` e `lib/organic-*.json` da última versão validada. Registre endpoint, código, momento e erro sem alterar `collectedAt`, `sourceLoad` ou `lastmod`. Uma mudança de schema, total inconsistente, IDs repetidos ou cidade divergente exige investigação antes de nova publicação. Não substitua ausência por zero ou histórico imaginado.

## Rollback

Antes de publicar, confira o commit e a versão live no Sites. Após uma falha de produção, volte à última versão salva e publicada com sucesso pelo fluxo nativo de versões/deploy do Site, preservando domínio e audiência públicos. Para rollback local antes do push, recupere o backup `.sites-runtime/data-backup-*`, regenere os derivados e repita avaliações; não copie o banco SQLite de candidato sobre dados públicos. O relatório de release registra versão e commit atuais e anteriores. Um rollback não transforma a data de coleta antiga em data de hoje.
