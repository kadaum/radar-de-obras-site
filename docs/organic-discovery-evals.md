# Avaliações de descoberta orgânica

Data: 24/09/2026. Ambientes locais: `vinext dev` em `http://localhost:3002` e Worker de build em `http://127.0.0.1:3003`; produção anterior: versão 10. A publicação no domínio público foi verificada.

| Risco | Checagem e evidência | Resultado |
| --- | --- | --- |
| Dados duplicados, recorte incorreto | Coleta de 24/09: 153.703 projetos, 239.516 geometrias, 39 blocos; totais paginados conferem, 153.703 IDs únicos, zero geometrias órfãs, SQLite íntegro, carga da fonte estável. Os dez IDs mantiveram cidade/UF. SHA-256 de entrada: `77b91d69ce458e88fcba42765e44da00af7527450958a69bc03aaf4232d08952`. | PASS |
| Dados divergentes da fonte | Consulta por ID às dez fichas após a coleta; nome, UF, status, previsão e órgão conferiram (zero `snapshotDifference`). Uma data efetiva de `4902.35-23` precede o início previsto e recebe ressalva na ficha. | PASS com ressalva factual |
| Totais e tabela | `scripts/eval-organic.mjs` confronta contagem de cada cidade com o snapshot; HTML HTTP contém H1, tabela, valores e vínculos. | PASS (5/5 testes no dev, 5/5 no Worker de build e 5/5 no domínio público) |
| Canonical/sitemap/schema | 22 URLs canônicas, self-canonical em cidades/fichas, JSON-LD parseável e ligado à página, Dataset apenas `/dados`; CSV/JSON 200. | PASS |
| Filtros e 404 | `q` dá resultado específico, `noindex,follow` e canonical limpo; cidade/ID/slug inválidos e página fora da faixa retornam 404. | PASS |
| Fonte indisponível | `node --import tsx --test scripts/eval-fallback.test.mjs`: ID selecionado devolve último snapshot com aviso e timestamps reais; ID sem snapshot devolve 502. | PASS (2/2 testes) |
| Navegação de produto | Browser: cidade → ficha → `/radar.html?obra=ID`, detalhe selecionado; reload e histórico back/forward confirmados. O mapa no Worker de build carregou 153.703 registros e o link de volta à ficha. Cidade e deep link também verificados no domínio público. | PASS |
| Visão agregada e filtros | `map-overview.json` resume todos os 151.959 pontos válidos em 2.159 células; soma dos pesos confere. Acima do zoom 7, o mapa usa pontos individuais da área visível, mantendo 153.703 registros para busca/lista/exportação. No browser móvel, o filtro “Em execução” devolveu 20.935, igual à contagem nos blocos, e a lista exibiu 1.000 linhas mais aviso de limite. | PASS local após correção de performance |
| Mobile e acessibilidade básica | Browser em 360 px: cidade/ficha sem overflow horizontal; Belo Horizonte após refresh mediu `scrollWidth` 345 px e viewport 360 px. Tab percorreu marca, navegação e breadcrumbs; busca → situação → botão seguiram em ordem, todos com outline `solid`. CSS desliga transição/transform dos cards sob `prefers-reduced-motion: reduce`. | PASS parcial; emulação de reduced motion não disponível no navegador conectado |
| Mapa e geolocalização | Mapa abre sem pedir geolocalização. Lista e filtros aparecem. Tiles ficaram em branco intermitentemente no browser conectado, mas apareceram nas capturas do Chrome/Lighthouse antes, depois e no mapa otimizado, sem erro de console. | PASS funcional; diferença do ambiente de teste |
| Console/hidratação | `tab.dev.logs` sem erro ou aviso na navegação local e baseline público amostrados. | PASS na amostra |
| Campo de performance | Nenhum dado de campo de LCP, CLS ou INP e nenhum painel GSC/GA4 acessível. Metas: LCP ≤2,5 s, CLS ≤0,1, INP ≤200 ms. | NOT RUN para Core Web Vitals; não alegamos aprovação |

Comandos locais:

```text
npm run lint
npm run build
node scripts/eval-organic.mjs http://localhost:3002
node --import tsx --test scripts/eval-fallback.test.mjs
```

Imagens verificadas visualmente no browser conectado: mapa publicado anterior em desktop; hub de cidades em desktop; cidade e ficha em 360 px; home com mapa em 360 px. A navegação principal, cabeçalho, tabela e estados de filtro foram inspecionados também pela árvore de acessibilidade. O HTML HTTP, e não a execução de JavaScript, sustenta os checks de conteúdo e metadados.

Os testes de laboratório não equivalem a dados de campo. Os caminhos novos não tinham baseline 200 comparável antes da publicação.

Lighthouse 12 em Chrome 153, perfil móvel com simulação padrão. O release inicial de 24/09 (versão 12) expôs uma regressão em uma execução pública do mesmo caminho `/radar.html`:

| Medida | Antes (versão 10; 130.581 projetos) | Após (153.703 projetos) |
| --- | ---: | ---: |
| Score performance | 0,30 | 0,31 |
| FCP | 3,15 s | 3,94 s |
| LCP | 52,06 s | 64,16 s |
| TBT | 8,29 s | 8,80 s |
| CLS | 0,003 | 0,001 |
| TTFB no relatório | 1,94 s | 0,20 s |

A carga cresceu 17,7% em projetos; isso pode contribuir, mas uma única execução não isola a causa. A investigação encontrou duas tarefas grandes no caminho inicial: parse de 39 blocos JSON na main thread e agrupamento de 151.959 pontos no MapLibre, além de 1.000 linhas de tabela montadas mesmo na visão do mapa. A correção inicia o mapa com um resumo fiel de 2.159 células, transfere o parse a um Worker, só monta a tabela quando aberta e só envia pontos individuais da área visível a partir do zoom 7. Busca, filtros e exportação continuam usando os 153.703 IDs.

Foram feitas **três medições locais pareadas por versão**, com build Worker, mesmo Chrome/flags/perfil móvel, portas localhost equivalentes e o mesmo caminho. As medianas abaixo não são dados de campo:

| Medida | Versão 10, 130.581 projetos | Correção candidata, 153.703 projetos |
| --- | ---: | ---: |
| Score performance | 0,41 | 0,64 |
| FCP | 2,88 s | 3,00 s |
| LCP | 61,36 s | 3,00 s |
| TBT | 2,27 s | 1,22 s |
| CLS | 0,0035 | 0,0035 |

Para isolar a mudança de código do aumento da base, mais três pares locais usaram os mesmos 153.703 registros nas duas versões do mapa: mediana de score 0,60 → 0,64, LCP 3,10 → 3,00 s e TBT 2,52 → 1,31 s. O LCP variou muito entre lotes do mapa antigo com a mesma base (3 a 45 s), provavelmente por carga de rede/tiles e estado do servidor; não atribuímos toda a diferença à mudança de código. O TBT caiu nos pares com a mesma base. A home anterior gerou `NO_FCP` no Lighthouse apesar de thumbnails com conteúdo; não há score comparável para ela. O Lighthouse terminou com erro de limpeza do perfil temporário no Windows após salvar os relatórios completos do mapa.

Em cinco requisições HTTP ao mesmo domínio com `cache-control: no-cache`, a mediana de TTFB/total da home passou de 75/77 ms para 84/86 ms, e `/radar.html` passou de 147/148 ms para 102/103 ms na versão 12. São proxies de resposta HTTP, não LCP, CLS ou INP de campo. A correção candidata passou na checagem de **29 recursos locais** sem falhas, incluindo integridade do resumo agregado; a carga da fonte permaneceu `2026-09-24T00:00:00`. A checagem pública da versão corrigida é registrada no relatório de release.
