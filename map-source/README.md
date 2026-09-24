# Fonte editável do mapa

Baseada no código público do Radar de Obras, commit `e625d5d` (licença MIT incluída em `LICENSE`). `npm run build` recompila esta fonte e atualiza os assets de `public/radar.html` antes do build do Site.

A visão nacional é derivada de **todos** os pontos válidos do snapshot em células de 0,5 grau (`scripts/build-map-overview.mjs`). O mapa exibe essas contagens agregadas abaixo do zoom 7. A partir do zoom 7, os pontos individuais da área visível são extraídos do mesmo snapshot; mover o mapa atualiza a área. A busca, os filtros, os totais, a lista e a exportação continuam usando o conjunto completo de registros. As consultas por ID usam o mesmo identificador e a API local de detalhes.

O arquivo completo é carregado em um Web Worker após iniciar o mapa. A tela indica carregamento e mantém os controles de dados desativados até conferir a contagem do manifesto. O worker tem leitura direta como fallback se não estiver disponível. Uma carga posterior com a mesma data oficial não baixa os 39 blocos novamente. A visão agregada nunca é usada para responder a busca ou exportação como se fosse o conjunto completo.
