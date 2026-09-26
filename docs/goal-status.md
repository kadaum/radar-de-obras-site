# Estado atual do goal — 26/09/2026

Este resumo prevalece sobre as entradas históricas de improvement-goal.md. Goal ativo; não concluído.

## Publicado

v23, commit 2b8c5d31c984b265b2841c3b110cbc6cbb4e1ed1, deploy appgdep_6ab73a4df8e8819192fe3b90c5c5a1fc, succeeded 03:22:01 UTC. Público preservado; Google não implementado. Carga validada 25/09/2026 com 153.756 projetos. Nenhum coletor ou preview local está ativo.

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

Mudanças locais após v23, ainda não publicadas: documentação e auditoria; fichas nacionais com empenhos/pagos e estudos em detalhes expansíveis, progresso somente para medição única válida de consulta completa. Cache v2 consulta quatro endpoints em paralelo. Testes de cache 3/3, TypeScript e lint passaram. Validação de renderização/latência e publicação pendentes.
