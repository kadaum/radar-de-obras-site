# Marca e interface — Radar de Obras

## Identidade

O Radar transforma registros públicos complexos em leitura verificável. A interface deve mostrar primeiro o que a pessoa quer saber (situação, localização, valor e prazo), depois o contexto, sempre com origem e ressalvas junto dos números. A aparência combina precisão editorial com sensação de mapa público: fundo mineral claro, verde de referência e verde limão para ações leves. Âmbar é reservado a discrepâncias ou avisos que merecem atenção, nunca a uma acusação de irregularidade.

## Tokens implementados

| Papel | Token CSS | Valor | Uso |
| --- | --- | --- | --- |
| Texto principal | `--radar-ink` | `#10231a` | títulos e informação de maior peso |
| Ação principal | `--radar-green` | `#175a43` | links, botões, estado ativo |
| Ação hover | `--radar-green-hover` | `#0d4431` | hover do botão principal |
| Destaque positivo | `--radar-lime` | `#c8eb9d` | compartilhar e abrir mapa |
| Fundo | `--radar-canvas` | `#f7f8f2` | canvas de leitura |
| Superfície | `--radar-surface` | `#ffffff` | cartões e resultados |
| Superfície verde | `--radar-surface-tint` | `#eef5ef` | classificação, filtros e progresso |
| Borda | `--radar-border` | `#d3dfd5` | separação de conteúdo |
| Texto secundário | `--radar-muted` | `#52685a` | origem e qualificadores |
| Atenção | `--radar-amber` | `#c48a1c` | alertas editoriais específicos |
| Canto de cartão | `--radar-radius` | `14px` | cartões extensos |

Botões usam pelo menos 44 px de altura, cantos de 9–11 px, foco visível de 3 px e feedback de ação. Cartões usam borda fina e sombra discreta; hover altera a elevação em até 3 px. As transições respeitam `prefers-reduced-motion`. A área ativa no índice é identificada por fundo e barra, sem depender apenas da cor.

## Hierarquia

1. Título e área oficial clicável.
2. Ações primárias (enviar atualização ou abrir mapa), compartilhar como ação secundária destacada.
3. Resumo com valores declarados e ressalvas adjacentes.
4. Índice por seções e conteúdo sem esconder as respostas principais.
5. Fontes e sugestões de navegação pela região e pela área.

## Conteúdo e evidência

Não converter investimento previsto em valor pago; nem execução física em entrega; nem distância entre pontos do cadastro em localização exata. Páginas de área reproduzem o campo oficial “tipo”, consolidando apenas diferenças de maiúsculas/minúsculas para navegação. Busca e páginas paginadas existem para exploração; apenas a página inicial de cada área entra no sitemap de áreas.

Referências usadas: [aluno.com.br](https://aluno.com.br/universidades/universidade-cruzeiro-do-sul/pedagogia) para índice, indicadores e “veja também”; [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) para links internos rastreáveis; [Google Search Central](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading) para paginação. Stripe e Linear inspiraram ritmo, agrupamento e feedback visual sem copiar sua identidade.
