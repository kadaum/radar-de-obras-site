# Avaliações de descoberta orgânica

Data: 24/09/2026. Ambientes locais: `vinext dev` em `http://localhost:3002` e Worker de build em `http://127.0.0.1:3003`; produção anterior: versão 10. O relatório de release registra a verificação no domínio após publicação.

| Risco | Checagem e evidência | Resultado |
| --- | --- | --- |
| Dados duplicados, recorte incorreto | Coleta de 24/09: 153.703 projetos, 239.516 geometrias, 39 blocos; totais paginados conferem, 153.703 IDs únicos, zero geometrias órfãs, SQLite íntegro, carga da fonte estável. Os dez IDs mantiveram cidade/UF. SHA-256 de entrada: `77b91d69ce458e88fcba42765e44da00af7527450958a69bc03aaf4232d08952`. | PASS |
| Dados divergentes da fonte | Consulta por ID às dez fichas após a coleta; nome, UF, status, previsão e órgão conferiram (zero `snapshotDifference`). Uma data efetiva de `4902.35-23` precede o início previsto e recebe ressalva na ficha. | PASS com ressalva factual |
| Totais e tabela | `scripts/eval-organic.mjs` confronta contagem de cada cidade com o snapshot; HTML HTTP contém H1, tabela, valores e vínculos. | PASS (5/5 testes no dev e 5/5 no Worker de build) |
| Canonical/sitemap/schema | 22 URLs canônicas, self-canonical em cidades/fichas, JSON-LD parseável e ligado à página, Dataset apenas `/dados`; CSV/JSON 200. | PASS |
| Filtros e 404 | `q` dá resultado específico, `noindex,follow` e canonical limpo; cidade/ID/slug inválidos e página fora da faixa retornam 404. | PASS |
| Fonte indisponível | `node --import tsx --test scripts/eval-fallback.test.mjs`: ID selecionado devolve último snapshot com aviso e timestamps reais; ID sem snapshot devolve 502. | PASS (2/2 testes) |
| Navegação de produto | Browser: cidade → ficha → `/radar.html?obra=ID`, detalhe selecionado; reload e histórico back/forward confirmados. O mapa no Worker de build carregou 153.703 registros e o link de volta à ficha. | PASS |
| Mobile e acessibilidade básica | Browser em 360 px: cidade/ficha sem overflow horizontal; Belo Horizonte após refresh mediu `scrollWidth` 345 px e viewport 360 px. Tab percorreu marca, navegação e breadcrumbs; busca → situação → botão seguiram em ordem, todos com outline `solid`. CSS desliga transição/transform dos cards sob `prefers-reduced-motion: reduce`. | PASS parcial; emulação de reduced motion não disponível no navegador conectado |
| Mapa e geolocalização | Mapa abre sem pedir geolocalização. Lista e filtros aparecem. Tiles externos vieram em branco no browser antes e depois, sem erro de console; não usamos isso para inferir falha de produção geral. | PASS funcional, limite visual externo |
| Console/hidratação | `tab.dev.logs` sem erro ou aviso na navegação local e baseline público amostrados. | PASS na amostra |
| Campo de performance | Nenhum dado de campo de LCP, CLS ou INP e nenhum painel GSC/GA4 acessível. Metas: LCP ≤2,5 s, CLS ≤0,1, INP ≤200 ms. | NOT RUN para Core Web Vitals; não alegamos aprovação |

Comandos locais:

```text
npm run lint
npm run build
node --test scripts/eval-organic.mjs http://localhost:3002
node --import tsx --test scripts/eval-fallback.test.mjs
```

Imagens verificadas visualmente no browser conectado: mapa publicado anterior em desktop; hub de cidades em desktop; cidade e ficha em 360 px; home com mapa em 360 px. A navegação principal, cabeçalho, tabela e estados de filtro foram inspecionados também pela árvore de acessibilidade. O HTML HTTP, e não a execução de JavaScript, sustenta os checks de conteúdo e metadados.

Os testes de laboratório não equivalem a dados de campo. A comparação de tempo de resposta HTTP será registrada após publicação usando o mesmo host e rotina de requisições; novos caminhos não tinham baseline 200 comparável.

Lighthouse 12 em Chrome 153, perfil móvel com simulação padrão: `/radar.html` na versão anterior obteve score 0,30, FCP 3,15 s, LCP 52,06 s, TBT 8,29 s e CLS 0,003. A home anterior gerou `NO_FCP` no Lighthouse apesar de thumbnails com conteúdo; não há score confiável para ela. Esses valores são uma execução de laboratório, sujeitos à rede e ao carregamento do mapa. O relatório de release compara o mesmo caminho e configuração após publicar. O Lighthouse terminou com erro de limpeza do perfil temporário no Windows, mas gravou o relatório completo do mapa.
