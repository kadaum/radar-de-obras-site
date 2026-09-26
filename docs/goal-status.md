# Estado atual do goal — 26/09/2026

Este resumo prevalece sobre as entradas históricas de improvement-goal.md. Goal bloqueado por dependência externa; não concluído.

## Publicado

v27, commit 8d8b9e37e603d2cfd12dd9758d72513fda50f768, deploy appgdep_6ab7419e540c81918f404caed2323324, succeeded 03:53:13 UTC. Público preservado; Google não implementado. Carga validada 25/09/2026 com 153.756 projetos. Nenhum coletor ou preview local está ativo.

- Fichas nacionais SSR, política de indexabilidade e quatro sitemaps nacionais; 153.289 URLs nacionais elegíveis mais 22 centrais.
- Taxonomia oficial com ícones e tipo derivado conservador separado, recalculado da fonte. 24.925 correspondências; resto abstém. Avaliação limitada documentada.
- Mapas, contratos/medições consultados, distinção dos papéis administrativos e da empresa, dados opcionais em detalhes, fotografias verificadas no piloto, finanças e explicação documental histórica de Pirituba.
- Controle de contagens atípicas sem corrigir o original; critério estatístico não confirma erro nem certifica demais valores.
- Favicon, fontes técnicas rotuladas, abertura de ficha completa, botão separado de resumo; busca/filtros da lista preservados na sessão, exceto recorte espacial.
- Contribuições anônimas somente nas dez fichas piloto, fila privada pending, validação e limite HMAC por rede. Isso não satisfaz contas Google ou moderação persistida por usuário.

## Evidência atual

- Publicação confirmada pela API Sites; relatórios release-v19 até release-v23 em outputs fora do checkout.
- Carga: preservação completa dos registros e contexto, integridade do SQLite, IDs e geometrias validados; snapshot/enriquecimento da mesma carga.
- Testes de cache/fallback/rede/contribuições locais registrados; produção somente leitura.
- Auditoria de 26/09 após v23: eval-organic 7/7 em produção. audit-public-semantics 32 páginas, zero falhas: 22 centrais e amostra sistemática de dez shards nacionais; títulos/description/canonical/H1/idioma/JSON-LD/breadcrumbs/alt/dimensões no HTML cru. Não é validação externa Schema.org/rich-results nem auditoria de todas as fichas renderizadas.
- Reflow 360/390/768/1440 e teclado com casos registrados. Contraste calculado nos textos de páginas selecionadas. Não equivale a WCAG completa; zoom real 200% ainda não comprovado.
- Lista → ficha → back e Limpar aprovados por teclado em v23; controle de mouse teve resultados inconsistentes e não recebeu aprovação ampla.

## Pendências que impedem conclusão

1. Login Google, contas, próprias contribuições, exclusão, sessão e autorização, moderação persistida e testes reais de provedor/isolamento. Só CONTRIBUTION_NETWORK_SECRET existe no ambiente. Projeto/cliente Google não fornecido; caminho de OAuth público externo precisa ser confirmado conforme Sites Authentication.
2. Auditoria final independente e fechamento de lacunas de UX/acessibilidade e alcance dos dados; não inferir aprovação a partir de testes estreitos.
3. Comparação de custos: pesquisa documental concluída como piloto; proposta vencedora digitalizada ainda sem OCR validado/revisão técnica item a item. Nenhum julgamento de preço está publicado. Qualquer avanço para tal julgamento exige evidência adicional.
4. Descoberta real em buscadores/agentes: testes técnicos não comprovam indexação, ranking ou citação. Search Console/telemetria não disponíveis nesta auditoria.

Incremento v24 publicado: fichas nacionais com empenhos/pagos e estudos em detalhes expansíveis, progresso somente para medição única válida de consulta completa. Cache v2 consulta quatro endpoints em paralelo. Testes de cache 3/3, nacionais 4/4, TypeScript, lint e build passaram. Comparação fonte versus HTML inicial em 12 fichas: 81 valores conferidos (77 contratuais/financeiros + quatro tipos de estudo). Dez IDs sistemáticos e dois casos dirigidos, não estimativa de cobertura nacional. A primeira rodada sem cache para nove novos IDs teve respostas de 190–475 ms; repetições 10–16 ms no preview local. Tempos não representam produção ou carga concorrente. Mobile 360: detalhes financeiros expandidos por teclado sem overflow. Nenhum preview ou workflow ativo.

## Incremento v25

Índice nacional de proximidade publicado, recalculado no build: 145.031 projetos com até três registros a 5 km; 420.150 vínculos. Todos os vínculos validados por integridade e 35 casos comparados com busca exaustiva. HTML de três fichas conferido; mobile 360px sem overflow e navegação por teclado para ficha próxima confirmada. Distância entre pontos aproximados/administrativos não comprova localização física. Fichas piloto mantêm seleção no recorte das cidades; nacionais usam novo índice. Build, tipos e lint passaram; preview encerrado.

Automação semanal autoritativa confirmada ACTIVE em 26/09: acompanhar-radar-de-obras-por-90-dias, término 23/12/2026. Coordenação executada pelo Codex; não é cron autônomo na hospedagem. Runbook atualizado. O maior pacote tem 255.528.960 bytes expandidos, ainda abaixo do limite de 256 MiB; monitorar crescimento nas próximas cargas.

## Incremento v26

Lista usa somente sua própria busca e filtros: sidebar duplicado oculto no modo lista, contador no cabeçalho, botão Limpar busca e filtros. Mobile 390px sem overflow; busca Pirituba→resumo→fechar→limpar testados por teclado; resultado único e retorno a 153.756 confirmados. Build/lint/tsc passaram. Publicação succeeded. Mouse segue não verificado: ações do navegador não dispararam busca de forma confiável; não confundir limitação da automação com prova de defeito no produto. Formulário em produção observado inicialmente disabled durante carregamento; tentativa de inspeção final não teve resultado estável, sem conclusão nova de disponibilidade. Nenhum envio feito. Preview encerrado. Pacote 257.751.040 bytes, 533 arquivos; ativos antigos acumulados precisam de limpeza controlada antes de atingir 256 MiB.

## Incremento v27

Build arquiva bundles index JS/CSS antigos em .sites-runtime/map-assets-archive, preservando ativos do build atual e referências do HTML anterior ao build. Workers e arquivos sem padrão index ficam intactos. Caminhos resolvidos validados antes de mover. Primeira limpeza arquivou 13 arquivos; public/assets de 12.492.227 para 1.652.087 bytes. Pacote publicado de 257.751.040 para 246.896.640 bytes. Identidade byte a byte dos quatro ativos do build e referências HTML aprovadas, lint/build final passaram, segundo build idempotente sem novo arquivo arquivado. JS/CSS referenciados em produção responderam 200. Contribuições GET produção 200, no-store, available true. Nenhum envio ou identidade de usuário testado. Sem processos ativos.

## Avaliação ampliada em produção após v27

Eval nacional ampliada comparou seis campos do cadastro por ficha (situação, investimento, responsável, localização, início e término) contra snapshot, além de contratos/empenhos/estudos contra API. 12 fichas, 153 comparações aprovadas; ressalvas financeiras e de prazo presentes no HTML inicial. Todas as consultas complementares completas nesta rodada. Primeiras respostas 414–1260 ms; segundas 49–924 ms (uma resposta alta), não benchmark controlado nem Core Web Vitals. Evidência em outputs/national-records-production-2026-09-26.json.

Autenticação revalidada: variáveis Sites revisão 1, somente CONTRIBUTION_NETWORK_SECRET. Skill Sites authentication.md continua exigindo confirmação de caminho para OAuth público externo; documentação/ferramentas expostas não confirmam Google. Não há cliente Google fornecido, sessão, contas ou moderação vinculada implementados. Não concluir o goal. Os testes amplificados são mudança local de avaliação, sem nova versão de produto necessária.

## Bloqueio registrado

Após três rodadas consecutivas com a mesma dependência de autenticação, status do goal alterado para blocked. Revalidação final: ambiente revisão 1, apenas CONTRIBUTION_NETWORK_SECRET; sem cliente Google nem confirmação do caminho OAuth externo exigida pela skill Sites. Pergunta ao proprietário permanece sem resposta. Não há processo a aguardar. Retomar com configuração/suporte resolvidos, preservando todos os critérios da delivery-audit.md. v27 segue publicada e a automação semanal é independente deste bloqueio.

## Mudança de escopo de identidade pelo proprietário

26/09/2026: Google substituído por login por link de e-mail. Interromper preparação no Google Cloud. Banco Sites e /admin por produto permanecem. Plano concreto e critérios em email-login-plan.md; aguardando identificar remetente/provedor gratuito e confirmar caminho da hospedagem. Não apresentar OAuth Google como dependência vigente. Nenhuma nova versão publicada.

## Login adiado pelo proprietário

26/09/2026: usuário pediu deixar login para depois, mantendo exigência de custo zero. Não continuar OAuth, magic link ou contratação de remetente. Motivação é captar leads; formulário opcional no banco existente é alternativa futura, ainda não implementada. Contas/admin permanecem não entregues e adiados, não declarar concluídos. Não prometer armazenamento/envio ilimitados. Não há autorização para disparos comerciais. Esta decisão suspende a frente de login, não determina pausa de todo o objetivo nem conclusão automática das demais frentes.
