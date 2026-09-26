# Revisão da leitura das fichas — 26/09/2026

## Diretriz

Unificar o padrão visual das dez fichas piloto e das fichas nacionais: painel de resumo com situação, execução física válida, investimento previsto, prazo e data da base. Menu lateral persistente no desktop, índice horizontal compacto no mobile. Conteúdo principal aberto, em seções com títulos e âncoras estáveis; recolhimento reservado a dados técnicos e explicações complementares.

## Referências consultadas

- https://aluno.com.br/universidades/universidade-cruzeiro-do-sul/pedagogia — índice da página e indicadores antes do conteúdo longo.
- https://stripe.com/payments — hierarquia visual e agrupamento por assunto.
- https://linear.app/features — navegação concisa e seções bem delimitadas.
- https://www.w3.org/WAI/tutorials/menus/structure/ — estrutura semântica de navegação.

Aplicação ao Radar: preservei a identidade verde, acrescentei índice numerado com seção ativa, cartões claros e dados principais abertos. Não foram copiadas animações decorativas. Transições de foco/hover são discretas e respeitam movimento reduzido. Não há promessa de ranking decorrente do menu; a melhoria técnica é conteúdo SSR, títulos, links internos e semântica legível.

## Evidências

- TypeScript, lint e build: aprovados.
- eval-work-navigation.mjs: dez fichas piloto + duas nacionais; âncoras únicas/existentes, H1 único, resumo visual, canonical, JSON-LD e seções principais fora de details.
- eval-national-fiches.mjs: quatro testes aprovados; preservação dos 153.756 registros, sitemap segundo a política vigente, HTML SSR, 404, redirect e ressalvas de população atípica.
- Browser: desktop com menu lateral e cartões; Enter no link Contratos posiciona o título a 26px do topo e atualiza aria-current. Mobile 390px e 320px sem overflow horizontal da página; alvo abaixo do índice, campos nulos explícitos e alertas de qualidade preservados.
- E-mail privado, consentimento e contribuições existentes preservados. Nenhum dado de negócio ou critério de indexação alterado nesta revisão.
