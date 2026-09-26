# Auditoria de entrega — 26/09/2026, após v27

Estado: objetivo não concluído. Fonte operacional: goal-status.md. Produção v27 / commit 8d8b9e37e603d2cfd12dd9758d72513fda50f768. Mudanças locais posteriores são avaliação e documentação; não representam nova publicação.

| Requisito do proprietário | Evidência examinada | Resultado e limite |
|---|---|---|
| Classificação oficial amigável | components/work-classification.tsx, contexto nacional, releases v19–20 | Publicada, valores oficiais separados do tipo derivado. |
| Classificação determinística atualizável | lib/derived-work-type.mjs, cobertura e holdout registrados | Publicada; seis regras conservadoras, 24.925 correspondências. Amostra não certifica precisão nacional. |
| Mais dados sem confundir | national-context, official-work-records, work-enrichment | Dados secundários recolhidos; campos vazios, consulta parcial e indisponibilidade distintos. |
| Empresa versus tomador/executor | contratos com fornecedor/CNPJ/objeto/vigência; papéis administrativos em contexto | Publicado. Ausência no endpoint não prova ausência de contrato; vínculo não prova atuação atual. |
| Finanças compreensíveis | v24, eval nacional ampliada em produção | Investimento, contrato, empenho, pago e restos a pagar separados; sem totais potencialmente duplicados. |
| População/empregos | impact-quality e v22 | Valores atribuídos e secundários; controle estatístico não certifica qualidade factual. |
| Mapa e proximidade | v25, eval-national-nearby | Sugestões nacionais em 145.031 projetos; 420.150 vínculos íntegros, 35 casos exaustivos. Coordenadas podem ser administrativas. Pilotos usam recorte de cidades. |
| Fotos públicas e atualização | work-overview/WorkPublicContext e pesquisa documental | Foto histórica de Pirituba verificada. Não há evidência de endpoint utilizável para fotos nacionais ou atualização automática de imagens. ind_foto não é URL. Alcance limitado explicitamente. |
| Navegação completa, fontes, favicon | releases v19–26, eval-organic, auditoria semântica | Links completos, resumo opcional, fontes técnicas rotuladas, favicon publicado. Lista mantém filtros por sessão, exceto recorte espacial. |
| UX desktop/mobile e acessibilidade | relatórios de reflow/contraste/teclado, v26 | Casos em múltiplas larguras aprovados; controles duplicados removidos. Mouse inconclusivo por automação; zoom real 200% não comprovado. Não declarar certificação WCAG. |
| SEO e agentes | 32 páginas na auditoria estrutural, 7 evals piloto, avaliação de 12 nacionais/153 campos | HTML inicial, títulos, descriptions, canonical, JSON-LD, sitemaps, imagens e respostas factuais com evidência técnica. Não prova ranking, indexação ou citações por modelos. |
| Atualização e operação | carga validada 25/09, automação autoritativa ativa, runbook, v27 | Refresh semanal via Codex até 23/12; não cron autônomo no Site. Build arquiva ativos antigos, rollback por versões. |
| Contribuições identificadas/login Google | env revisão 1; authentication.md; backlog; somente migration 0000 | NÃO implementado. Cliente Google ausente; caminho externo da hospedagem não confirmado. Somente contribuição anônima no piloto com fila privada e limite de rede. |
| Contas/moderação/isolamento/exclusão | código de contribuições e schema | NÃO implementados. Decisão editorial em arquivo não modifica estado pending no banco. Dependem da identidade real e testes entre contas. |
| Estimativa de custo fundamentada | cost-pilot-pirituba.md e contexto contratual publicado | Investigação piloto feita, orçamento/proposta/aditivo separados. Área e escopo insuficientes para comparação confiável; nenhum juízo de sobrepreço publicado. Modelo comparativo operacional não validado. |

## Próximas condições de avanço

1. Obter informação do proprietário sobre projeto Google Cloud e confirmar suporte/caminho de OAuth externo no Sites. Pergunta enviada; não solicitar segredo por chat. A skill Sites exige confirmação antes de criar auth própria. Não substituir por login ChatGPT sem decisão do proprietário.
2. Implementar e validar o fluxo completo de identidade, contribuições nacionais vinculadas, área própria, autorização, moderação persistida e exclusão. Testes com mocks não substituem login real.
3. Resolver a evidência de UX pendente em um navegador com controle confiável (mouse e zoom). Não repetir ações inconclusivas como se fossem aprovações.
4. Fotos nacionais automáticas, indexação de campo e modelo de custos permanecem limitados pela disponibilidade de fonte/acesso/evidência. Não preencher lacunas com dados inventados.

Não há processo confirmado em execução. O turno anterior foi progresso de avaliação. Esta auditoria não altera o escopo nem autoriza marcar o goal concluído. O impedimento de autenticação permanece; o objetivo depende de resposta/configuração externa.
