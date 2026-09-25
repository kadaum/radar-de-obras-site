# Fichas de obras: decisões de experiência e conteúdo

Pesquisa e implementação: 25/09/2026.

## Referências usadas

- Big Build, Epping Road Upgrade: resumo legível, localização, marcos e notícias do projeto. https://bigbuild.vic.gov.au/projects/roads/epping-road-upgrade
- HS2: mapa para explorar projetos próximos, acompanhado de informações textuais. https://www.hs2.org.uk/route-and-communities/interactive-route-map/
- FixMyStreet: contribuições simples orientadas a fatos e localização. https://fixmystreet.org/how-it-works/
- Google: conteúdo importante disponível para rastreamento e cuidados com spam de usuários. https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics e https://developers.google.com/search/docs/monitor-debug/prevent-abuse
- W3C: respeitar a preferência por movimento reduzido. https://www.w3.org/WAI/WCAG22/Techniques/css/C39

## Implementado

Resumo com situação cadastral, percentual físico quando disponível, investimento previsto, término previsto e data da base. Valores mantêm seus significados: orçamento não é pagamento e 100% informado não comprova funcionamento.

Mini-mapa com ponto cadastrado, acesso ao mapa interativo e até três registros próximos num raio de 5 km. Endereço e lista permanecem legíveis sem interagir com o mapa. Pontos podem representar endereços administrativos.

Navegação por seções, leitura em duas colunas no desktop e coluna única no celular, detalhes técnicos recolhidos, transições discretas e respeito a movimento reduzido. Conteúdo principal continua no HTML do servidor, com canonical e dados estruturados existentes.

Pirituba recebeu fotografia histórica e contexto de comunicados institucionais, com datas e créditos. UFBA recebeu referência a licitação pública. Demais fichas explicam quando nenhuma foto foi verificada. As associações por instituição, local e objeto são identificadas quando a notícia não cita o ID Obrasgov. Proveniência detalhada em work-photo-sources.md.

Colaboração sem cadastro: corrigir informação, informar andamento observado ou indicar foto/documento público. Observação exige data; indicação exige link. Conteúdo entra em fila privada, com validação e limite de envio, e exige revisão editorial antes de aparecer. Não existe feed de comentários públicos ou publicação automática. Operação descrita em contributions-review.md.

## Próximas lacunas a validar

1. “Foi inaugurada? Está funcionando?”: confrontar cadastro com comunicados do órgão e distinguir entrega física de serviço disponível, sempre com data.
2. “Qual é a próxima etapa?”: encontrar cronogramas, aditivos e ordens de serviço; não inferir fase a partir de um percentual.
3. “Quem executa e quanto já foi pago?”: cruzar contrato, processo, CNPJ e identificadores PNCP/Compras.gov; evitar juntar contratos pelo nome parecido ou somar empenhos como pagamentos.
4. “Como estava antes e como está agora?”: sequência de fotos verificadas com datas, autoria e condições de uso, sem atribuir foto genérica à obra.
5. “O que muda no meu bairro?”: entregas descritas e registros próximos, com cuidado para não chamar associação administrativa de localização física confirmada.

Essas são hipóteses editoriais baseadas nas informações fragmentadas encontradas, não estimativas de volume de busca ou garantia de tráfego. Priorizar com Search Console e contribuições reais após acumular dados. UGC só acrescenta valor quando resulta em informação útil, verificável e revisada.
