# Goal de evolução do Radar de Obras

## Estado atual

Consultar [goal-status.md](goal-status.md), quadro autoritativo. Publicado: v23, carga 25/09/2026, 153.756 projetos. Coletor encerrado; nenhuma coleta ou publicação em execução. As seções abaixo registram o planejamento e histórico, não o estado operacional atual.

Aberto em 25/09/2026 por solicitação do proprietário. Status: ativo. Base publicada: versão 18, commit b50eafe79397f73639cf5d926d4c98cf1844d425. Domínio e leitura pública devem ser preservados.

## Resultado esperado

Informações públicas mais completas, compreensíveis e verificáveis, com resumo útil em mobile e desktop, detalhes acessíveis sob demanda, navegação para fichas completas, descoberta por buscadores/agentes e contribuições vinculadas a contas. O objetivo inclui implementação, avaliações, testes, publicação e registro de limitações; criar este documento não conclui o goal.

## Ordem de execução e critérios

### 1. Auditoria e baseline — em andamento

- Inventariar capacidades realmente publicadas, testes e dados. Favicon e links para ficha já existem: verificar regressão em vez de recriar.
- Consolidar consultas de usuários: onde fica, situação, o que entrega, quanto prevê investir/contrata/paga, órgão responsável, empresa e documento.
- Executar testes existentes no preview e registrar falhas antes de alterações.
- Distinguir dez fichas SSR do piloto das demais fichas nacionais dependentes de JavaScript. A ficha nacional atual usa title genérico e canonical da home; determinar estratégia de rotas públicas e política de indexação para registros suficientemente completos, sem indexar combinações infinitas de filtros.

### 2. Fonte e classificação

- Expor eixo/tipo/subtipo oficiais com nomes amigáveis e ícones acompanhados de texto. Preservar código, valor de origem, multiplicidade e versão do mapeamento.
- Integrar classificação ao processamento de cada carga; desconhecidos e conflitos devem ter fallback explícito.
- Não promover as 15 regras exploratórias a fatos antes de avaliação independente por categoria. Medir precisão, cobertura e abstenção; separar classificação oficial de derivada. Incluir casos negativos como passarela de acesso à biblioteca.
- Finalidade/meta úteis, sem duplicação. Empregos e população apenas quando preenchidos e aprovados por controles de plausibilidade, com atribuição à fonte. Não somar beneficiários entre projetos.
- Executor/tomador/repassador distinguem-se da empresa contratada. Vínculo empresa–obra depende de contrato/identificador comprovado, papel e período. Medir cobertura nacional; ausência de contrato na API não comprova inexistência.
- Separar investimento previsto, valor contratual, empenhado, pago e execução física; não inferir total pago sem validar semântica/deduplicação.
- Fotos reais exigem origem, identidade e data; ind_foto=SIM não é URL ou quantidade de imagens.
- Preservar última carga validada em falhas e não alterar datas de coleta artificialmente. Rever coerência da atualização entre mapa, fichas, exports e enriquecimentos.

### 3. Experiência e acessibilidade

- Resumo com situação, localização, classificação, progresso informado, investimento previsto e atualização. Evitar descrição longa antes desses fatos.
- Bloco curto de responsáveis e empresa; documentos, CNPJ, processo, papéis administrativos, registros financeiros e informações técnicas em detalhes expansíveis.
- Texto completo útil no HTML, inclusive dentro de details/summary. Conteúdo repetido ou opcional vazio não ocupa cartões.
- Navegação lista → ficha completa, voltar, resumo lateral opcional, URL compartilhável, mapa/obras próximas e estados de carregamento/erro funcionais.
- Validar larguras 360, 390, 768 e 1440; zoom 200%, teclado, foco, nomes acessíveis, contraste, ausência de overflow da página e redução de movimento.
- Testar tarefas reais: identificar situação/custo/empresa, abrir documento, encontrar localização, enviar contribuição e voltar à lista. Animações breves sem bloquear tarefas ou mover conteúdo inesperadamente.

### 4. SEO e descoberta por agentes

- Auditar title, description, H1, canonical e idioma por tipo de página; metadados específicos e coerentes com conteúdo visível.
- HTML inicial legível sem JavaScript; links reais entre hubs, cidades e fichas. 404 reais para IDs inválidos e filtros controlados.
- Sitemap só de URLs canônicas elegíveis, lastmod por mudança material. Robots e comportamento HTTP verificados; não bloquear páginas públicas com login.
- JSON-LD parseável, válido semanticamente, fiel ao conteúdo visível, sem reviews, fatos ou licenças inventados. Verificar WebPage, BreadcrumbList, ItemList e Dataset onde cabíveis.
- Imagens verificadas com alt contextual, dimensões, carregamento adequado, crédito/data. Conferir favicon e metadados existentes de compartilhamento.
- Evals de extração sem JS para perguntas reais; comparar respostas com fatos e datas da fonte. llms.txt é auxiliar e não substitui HTML/indexação.
- Testes técnicos não demonstram ranking, indexação ou citação por IA. Search Console/analytics de campo continuam pendentes se não houver acesso.

### 5. Conta Google e contribuições

- Login Google aprovado pelo usuário. Consulta pública sem login; autenticação obrigatória no servidor para novos envios após integração funcional.
- Identidade estável do provedor, e-mail verificado privado, coleta mínima; nenhuma permissão de caixa do Gmail. Login não comprova veracidade.
- Preservar rascunho, logout, expiração, próprias contribuições, moderação, bloqueio, limites por conta/rede e prevenção de duplicatas. Legado anônimo permanece sem atribuição falsa.
- Testar redirecionamentos permitidos, validação de identidade/sessão, CSRF, acesso entre contas, bloqueios, expiração, cancelamento do login e persistência. Não substituir teste OAuth real por mock e declarar sucesso.
- Dependência a resolver: a referência atual Sites Authentication documenta SIWC/ChatGPT e exige confirmar o caminho da plataforma antes de OAuth público externo. Não substituir silenciosamente Google por ChatGPT, nem publicar um botão Google inoperante. Confirmar integração compatível e configuração do provedor antes da ativação; registrar eventual ação externa concreta necessária.
- Atualizar aviso de privacidade e fluxo de exclusão conforme dados efetivamente coletados; marketing requer opção separada.

### 6. Comparação de custos — pesquisa/piloto

- Definir família comparável, escopo, unidades, quantitativos, região e data-base; usar SINAPI/SICRO conforme aplicabilidade.
- Validar metodologia e documentos com revisão técnica e amostra independente antes de exposição pública.
- Não publicar selo caro/barato/sobrepreço usando apenas custo total, beneficiários ou percentual pago. Dados insuficientes devem permanecer assim.

## Gates de entrega

### Incremento local: navegação nacional e descoberta

- Ficha nacional agora renderiza contratos e medições na própria página, com fonte/data e detalhes nativos. Consulta limitada com cache transitório (10 minutos em sucesso, 30 segundos em falha, até 64 obras por instância); resultados incompletos são rotulados. Reavaliar custo/latência sob crawl antes de expansão operacional de tráfego.
- Links da lista do mapa, tabelas das cidades e obras próximas direcionam para `/obras/{id}` ou ficha piloto existente. A experiência de resumo lateral continua disponível.
- Política mínima de indexabilidade compartilhada por metadados e sitemap: nome, órgão, UF, localização e descrição presentes. Não é prova de qualidade editorial/ranking. 153.235 URLs nacionais elegíveis distribuídas em quatro sitemaps; dez fichas piloto seguem no sitemap central. Robots aponta para sitemap-index.
- Teste percorreu todos os registros e confirmou correspondência exata sitemap/política, ausência de IDs repetidos e limites de tamanho/contagem. Três avaliações nacionais e sete orgânicas passaram no Worker local 3005. Lint e TypeScript passaram após correções; rebuild após essas últimas correções de código ainda necessário.
- Entradas de contexto movidas para `source-data/context`, fora dos assets públicos; build migra contexto recebido em novas cargas. Geração anterior das fichas preservada em `.sites-runtime/fiches-before-context`. Publicação agora contém uma única geração de fichas (225.375.964 bytes antes de compressão), sem cópia pública de contexto.
- UI da biblioteca Pirituba verificada em 390px; abrir medição com Enter funcionou. Sem overflow horizontal em 360, 768 e 1440. Override removido. Ficha apresenta uma medição e ausência de contrato retornado, sem alegar inexistência de contratação.
- Worker ativo para continuar QA: sessão 40163, porta 3005. Nenhuma publicação; restam mapa/fotos/contexto nacional mais completo, contas, dados opcionais e avaliações de ponta a ponta.

### Incremento local: consultas completas e fallback nacional

- Extraída leitura oficial para `lib/official-records.mjs`: paginação até oito páginas por endpoint, orçamento de oito segundos, validação de envelope/contagens/ID e indicação explícita de respostas parciais. O limite é uma proteção operacional, não afirma completude quando atingido.
- API `/api/detail` passou a usar snapshot nacional no fallback. Campos preservados e data real permanecem identificados; indisponibilidade de fonte não vira ausência comprovada. IDs malformados retornam 400.
- Execuções distintas são devolvidas em lista. Só há percentual singular quando existe uma medição; mapa informa múltiplas medições em vez de alegar ausência ou consolidar indevidamente.
- Cinco testes puros aprovados: falha com ID real fora do piloto, paginação, rejeição de projeto errado, falha em página posterior/limite, 400/404/502 e coordenadas inválidas. São simulações controladas; não substituem teste de indisponibilidade da rota inteira no Worker.
- `npx tsc --noEmit` e build aprovados. Consulta real pelo Worker local 3005 em Pirituba: um contrato, uma medição, nenhum endpoint com erro/truncamento. Sessão Worker atual 45297; preview dev anterior encerrado após falha de HMR do framework. Encerrar Worker antes do próximo build.
- Nenhuma publicação realizada. Complementos na página nacional, redução do pacote e demais itens do goal continuam pendentes.

### Incremento local: contexto nacional e Worker

- `source/project-context.mjs` preserva classificação oficial com IDs, natureza, espécie, descrição, metas, finalidade, público e organizações; integração adicionada ao coletor de futuras cargas.
- Backfill da mesma carga validada de 24/09 para os 153.703 IDs, sem consultas novas ou mudança de datas. Fichas nacionais mostram ícones/texto do tipo oficial e detalhes nativos com contexto e papéis. Descrições idênticas são deduplicadas na apresentação.
- Campos numéricos de beneficiários/empregos foram preservados para análise; não viraram indicadores visuais antes de controles de plausibilidade.
- Leitor prefere binding ASSETS para acessar os arquivos da mesma versão, evitando dependência de fetch externo ao próprio domínio. Binding configurado em Vite e comprovado no Worker local de produção. Fallback de origem fixa permanece a validar no hosting real.
- Build concluído. Worker local em 127.0.0.1:3005, sessão 43487: 2/2 avaliações nacionais e 7/7 avaliações orgânicas passaram, incluindo classificação no HTML de obras fora do piloto.
- Encerrar a sessão Worker antes de rebuild no Windows: manter dist aberto bloqueia limpeza. O erro EPERM inicial foi resolvido encerrando a sessão anterior e recompilando.
- Pendências concretas: reduzir arquivos intermediários duplicados no pacote (contexto + fichas somam ~398 MB antes de compressão), ampliar complementos nacionais, links/sitemap e fallback de API; inspeção mobile nacional; autenticação e publicação.
- Login Google: ferramentas/configuração Sites atuais não expõem integração Google documentada, apenas SIWC. Isso não prova impossibilidade técnica. Nenhuma variável de autenticação está configurada. Pesquisa identificou candidato Google Identity Services com client ID público e validação de token no servidor; depende de confirmar suporte da plataforma e configurar o projeto Google. Pergunta sobre projeto existente enviada ao proprietário, sem solicitar segredos.

### Incremento local: fundamento das fichas nacionais

- Gerador `build-national-fiches.mjs` produz 163 shards imutáveis identificados por hash do conteúdo a partir dos 153.703 registros publicados. Integrado ao build; nenhuma nova coleta ou data inventada.
- Nova rota `/obras/{id}` renderiza resumo factual, fonte, título, descrição, canonical e WebPage no servidor. IDs piloto redirecionam permanentemente para suas fichas existentes; IDs ausentes retornam 404.
- Leitor carrega apenas um shard por requisição, com cache de quatro shards. URL de origem de produção fixa e host local restrito a desenvolvimento; não aceita origem arbitrária de headers. Erro de leitura não é convertido em inexistência do projeto.
- `npx tsc --noEmit` aprovado. `eval-national-fiches.mjs`: 2/2 aprovados, com igualdade integral dos 153.703 registros e HTTP de duas fichas nacionais, 404 e redirect 308 do piloto.
- Ainda incompleto e não publicado: rota precisa incorporar classificação/complementos, recuperação de erros, links de descoberta e sitemap conforme elegibilidade. O carregamento de assets em build Worker/produção precisa ser comprovado (dev usa origem local, produção usa domínio fixo). Não trocar links públicos antes dessas validações. A atual ficha do mapa permanece funcional até substituição completa.

### Baseline registrada em 25/09/2026

### Incremento local: clareza das dez fichas

- Implementados chips de tipo oficial com ícones, preservando texto da fonte; fallback visual para tipo novo. Não se trata de classificação inferida.
- Removida descrição duplicada do cabeçalho; descrição integral, metas, taxonomia completa e papéis administrativos disponíveis em detalhes nativos no HTML.
- Empresa destacada no bloco de participantes, diferenciada do executor/tomador; CNPJ agora disponível junto às datas e licitação. Não afirma atuação atual do fornecedor histórico.
- lastmod das dez fichas atualizado para a revisão material de 25/09; demais rotas preservadas.
- `npx tsc --noEmit` aprovado; `node scripts/eval-organic.mjs http://localhost:3004` aprovado em 7/7, incluindo metadados únicos, dados de empresa e conteúdo disponível sem JS.
- Inspeção via navegador da prévia em 360x800: resumo inicia aproximadamente em y=469; sem overflow horizontal. Abertura de CNPJ por Enter confirmou CNPJ visível; inspeção em 1440x900 realizada, sem avaliação completa de todas as tarefas. Override de viewport removido.
- Alterações ainda locais, não publicadas. Próximos trabalhos: fichas nacionais e fallback, atualização/classificação nacional, autenticação Google compatível, avaliações ampliadas e publicação do conjunto validado.

- Checkout aberto pelo fluxo Sites e confirmado no commit da versão 18; árvore inicialmente limpa.
- Preview dev local iniciado em http://localhost:3004; home respondeu HTTP 200 e conteúdo Radar de Obras.
- `node scripts/eval-organic.mjs http://localhost:3004`: 6 testes, 6 aprovados. Cobrem snapshot, cidades, dez fichas, semântica do enriquecimento, filtros/404 e Dataset.
- Estes testes aprovados não cobrem todas as lacunas do novo goal: nacional sem JS, extração por agentes, login Google e QA visual mobile ainda pendentes. Auditoria de pesquisa independente confirmou descrição duplicada, fallback nacional incompleto e lastmod a revisar.
- Servidor de preview retido para trabalho subsequente. Nenhuma alteração funcional/publicação nesta abertura do goal.

1. Integridade: IDs, cobertura, nulos/zero, unidades, proveniência, datas, conflitos e fallback.
2. Funcional: testes de navegação, erros e integração real para capacidades alteradas.
3. UX: inspeção visual mobile/desktop e tarefas por teclado; conteúdo prioritário visível e detalhes acessíveis.
4. SEO/agentes: rastreamento das rotas elegíveis, metadados/schema, extração sem JS, sitemap/robots/imagens e links.
5. Segurança das contribuições: identidade validada no servidor, isolamento, moderação e nenhum e-mail em HTML público/logs/analytics.
6. Publicação: build válido, versão/commit correspondentes, resultado nativo de deploy confirmado e verificação proporcional às mudanças autorizadas.

Registrar por gate: comando ou procedimento, ambiente, casos, resultado, evidência e limitações. Não converter medição local em dado de campo; não repetir testes sem risco concreto. O goal só conclui com escopo entregue e pendências externas explicitamente resolvidas ou reescopo autorizado.

### Incremento local: impacto, localização e avaliação de categorias

- Fichas nacionais agora incluem localização com mapa e link para exploração. Lista de vizinhos limitada ao piloto foi desativada nessas fichas para não aparentar cobertura nacional dessa seleção.
- População e empregos, quando numéricos e presentes, ficam em detalhes nativos fechados, atribuídos ao cadastro e acompanhados de ressalva de escala/estimativa. Não são rankings nem medidas comprovadas de impacto. Nulos não geram um painel vazio; zeros são preservados.
- Hub /obras e llms.txt atualizados para refletir as fichas nacionais, separar a seleção editorial de dez projetos e apontar para o índice de sitemaps.
- Revisão determinística independente da implementação: outputs/classification-analysis/review-v2.json registra 60 correspondências e 30 abstinências (89 projetos únicos). 57 correspondências sustentadas, duas incorretas e uma incerta na amostra. Quatro casos por regra não estimam precisão nacional. Protótipo conservador avaliado nos mesmos casos não constitui holdout. Regras amplas continuam fora do produto; fonte oficial preservada.
- Build, TypeScript e lint aprovados. eval-national-fiches.mjs 4/4 aprovado em Worker local 127.0.0.1:3005. Caso 13421.16-84 prova que valor extremo é preservado dentro de details com ressalva, sem destaque no cabeçalho.
- UI 390x844: população abriu por Enter; foco visível e ressalva legível. Largura do documento 375px, sem overflow. Override de viewport restaurado. Worker ativo sessão 52496; parar antes de rebuild Windows.
- Ainda local, não publicado. Pendências permanecem: custo de consultas complementares no rastreamento nacional e cache durável, QA amplo/SEO, Google Cloud e caminho de autenticação suportado, moderação, publicação e checagem real. Goal permanece ativo.

### Incremento: cache e segurança antes da publicação

- Consultas complementares das fichas usam cache da borda (Cache API) por até 6 horas se completas, 60 segundos se parciais/falhas; deduplicação concorrente por ID e cache local limitado a 64 entradas. Data original da consulta é preservada. Cache API pode ser removido e é regional; não é armazenamento durável nem limita o primeiro rastreamento de IDs distintos. Referência: https://developers.cloudflare.com/workers/runtime-apis/cache/ .
- eval-official-cache.test.mjs 3/3: concorrência, nova instância, expiração, falha curta, cache corrompido/indisponível. eval-fallback.test.mjs 5/5. TypeScript aprovado.
- Títulos nacionais incluem ID para distinguir projetos com nomes iguais. Verificador de saúde agora abrange três fichas nacionais distribuídas nos shards, índice e quatro sitemaps, além das páginas/ícones anteriores.
- Segurança de contribuições revisada: HMAC secreto, janela móvel preservada na virada do dia, ausência de IP confiável impede envio; endpoint de disponibilidade só leitura. Testes SQLite 3/3. Credencial de rede configurada como segredo Sites, revisão 1, sem expor valor. Não há autenticação Google implementada.

### Gate local do candidato

- Build npm concluído, TypeScript e lint aprovados. Helper build-site encontrou falha de resolução do shim npm.cmd no Windows; o mesmo script build foi executado diretamente por npm, sem alterar dependências/plugin.
- Worker 127.0.0.1:3005 (sessão 10361): avaliações nacionais 4/4, orgânicas 7/7; verificador de saúde 44 recursos, zero falhas. Fonte remota já informa carga 25/09; candidato preserva carga validada 24/09 e não a apresenta como a mais recente. Atualização deve passar novamente pelo coletor/validador antes de trocar snapshot.
- Base D1 local do Worker de produção estava vazia (caminho dist/server/.wrangler); migration existente foi aplicada somente localmente. Dois envios de teste ficaram pending. Proxy de desenvolvimento perdeu uma conexão POST e respondeu 500; banco confirmou gravação anterior. Este resultado não foi tratado como falha da API de produção nem como sucesso do teste; repetir gate após inspeção do estado.
- Reexecução isolada passou: eval-contributions.mjs valida persistência, fila privada e limite, com IP de teste único e Connection: close no ambiente local. A falha reproduzida estava no proxy de prévia com conexão reutilizada; não foi adicionada retentativa automática de POST ao produto. Testes de mutação permanecem proibidos fora de localhost/127.0.0.1.
- Gate pré-publicação: 4 avaliações nacionais, 7 orgânicas, 8 de cache/fallback, 3 de identificador de rede, integração de contribuições e 44 recursos de saúde aprovados; inspeções responsivas registradas nas seções anteriores. Autenticação Google e custos permanecem fora da entrega publicada até validação própria.

### Empacotamento compatível com o limite da hospedagem

- Primeira tentativa de salvar foi rejeitada pelo limite de 256 MiB expandidos; não houve deploy. Corrigida representação das fichas com esquema de colunas por shard e dicionário de textos repetidos (radar-fiches-v3), sem remover informações.
- Build passou de 306.146.963 para 241.019.372 bytes. eval-national-fiches agora compara também cada campo de contexto reconstruído com source-data para todos os 153.703 IDs: 4/4 aprovado. Saúde 44 recursos sem falhas; TypeScript/lint aprovados.
- Arquivos intermediários antigos preservados em .sites-runtime e retirados do pacote. Estado local D1 do preview também preservado fora de dist. Preview agora usa --persist-to fora da saída de build; não empacotar SQLite de testes.
- Windows: workflow requer Git Bash no PATH do processo e TAR_OPTIONS=--force-local para o caminho absoluto com letra de unidade. Nenhuma mudança no PATH global ou nos scripts do plugin.

### Classificação derivada conservadora — integração local

- Código congelado da avaliação incorporado sem ampliar regras: SHA256 660ee1ffe8dc899b7e27344bf58a039f4a384bf5485cd8cc49d5ebba85613d12 (LF). Seis classes: UBS, UPA, CAPS, creche/educação infantil, restaurante/refeitório, biblioteca.
- Detalhe nativo "Tipo identificado no título" preserva o nome cadastrado e separa a interpretação da taxonomia oficial. Metodologia explica regra, amostra, repetição textual e ausência de validação externa. Nenhuma afirmação de100% de precisão.
- Recalculado a partir do título em cada renderização; atualização validada da fonte não exige recategorizar manualmente. Snapshot24/09:24925 correspondências,128778 abstinências. Cobertura não equivale a precisão.
- eval-derived-types.mjs 4/4: hash congelado,140 casos da avaliação, regressões locativas, troca de título, cobertura nacional e HTML. TypeScript/lint aprovados. Em390x844, detalhe abriu por Enter, foco visível, largura375 sem overflow.
- Corrigido gerador de llms.txt, que ainda continha texto antigo do piloto e sobrescreveria a descrição nacional no refresh. Gerador de descoberta incorporado ao build.
- Nova coleta em execução: sessão57382, candidato .sites-runtime/organic-candidate-21iOgC. Última observação confirmou página100 de769 de projeto-investimento,20200 registros. Não promover antes do relatório validated e dos gates; nenhum dado novo foi publicado.
