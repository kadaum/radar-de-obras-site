# Descoberta orgânica — Radar de Obras

Atualizado em 24/09/2026. Escopo: Site público existente `appgprj_6aa038f27be48191a13e9e14cad7fe6c`, preservando `https://radar-obras.ricardoguia.com` e o mapa.

## Inventário inicial

| Rota | HTTP em produção antes da mudança | HTML inicial |
| --- | --- | --- |
| `/` | 200 | Metadados e WebApplication, mas conteúdo central apenas no iframe |
| `/radar.html` | 200 | Shell do mapa sem resposta textual de obras |
| `/robots.txt` | 200 | `User-agent: *; Allow: /` e sitemap |
| `/sitemap.xml` | 200 | Apenas a home |
| `/cidades`, `/obras` | 404 | Sem páginas de entidades |

Baseline via HTTP em 24/09/2026 18:27 UTC. Versão publicada 10, commit `1086c9008cc518a890146fdcb27b8a3d27e15d15`. A home tinha 19.326 caracteres de resposta, sem H1 ou tabela de obras no HTML inicial. O arquivo do mapa tinha 2.292 caracteres e dependia de JavaScript. O sitemap tinha 277 caracteres. Não há acesso conectado ao Search Console ou ao painel do GA4 nesta tarefa. Logs de Worker são operacionais e contêm crawlers e sondas; não equivalem a visitas humanas nem a indexação. Não foram medidos impressões, sessões, backlinks, LCP, CLS ou INP de campo.

## Perguntas e URLs do piloto

O piloto publica 22 canônicas: home, hubs `/cidades` e `/obras`, cinco páginas de cidade, dez fichas e quatro páginas de apoio. A escolha usa cobertura real da geometria do snapshot e projetos com nome, órgão, previsão, valor e fonte consultável. Não cria páginas para combinações arbitrárias de filtros.

| Cidade | URL | IDs das fichas |
| --- | --- | --- |
| Rio de Janeiro/RJ | `/cidades/rj/rio-de-janeiro` | `128622.33-16`, `7207.33-55` |
| São Paulo/SP | `/cidades/sp/sao-paulo` | `4902.35-23`, `59693.35-95` |
| Belo Horizonte/MG | `/cidades/mg/belo-horizonte` | `45919.31-65`, `92142.31-00` |
| Salvador/BA | `/cidades/ba/salvador` | `45892.29-61`, `60185.29-20` |
| Recife/PE | `/cidades/pe/recife` | `30125.26-63`, `41201.26-60` |

As fichas usam `/obras/{id}/{slug}`. O ID é a identidade; o slug editorial facilita leitura. URLs inexistentes ou com slug incorreto retornam 404. Os filtros `q`, `situacao` e `pagina` são estados da tabela: o HTML responde ao filtro, recebe `noindex,follow` e canonical da cidade sem parâmetros. Páginas fora da paginação real retornam 404.

As páginas de apoio são `/metodologia`, `/dados`, `/guia-de-interpretacao` e `/levantamento`. O levantamento calcula contagens com código sobre o mesmo snapshot do mapa e vincula cada recorte à sua cidade. Ele não acusa irregularidades nem interpreta diferenças de cadastro como ranking de obras locais.

Consultas exploratórias reais mostraram intenção em termos como obra do Pavilhão Rocha Lima, restaurante estudantil do campus Pirituba e prevenção de incêndio do HC-UFPE. Fontes institucionais apareceram nas buscas, incluindo [IFSP](https://ifsp.edu.br/ultimas-noticias/4031-campus-pirituba-inaugura-restaurante-estudantil) e [HU Brasil](https://www.gov.br/hubrasil/pt-br/hospitais-universitarios/regiao-nordeste/hc-ufpe/comunicacao/noticias/obras-do-plano-de-prevencao-e-combate-a-incendio-e-panico-ppcip-chegam-as-enfermarias-do-hc). A pesquisa não fornece volume de busca e não comprova que notícias e IDs do cadastro descrevam exatamente o mesmo contrato.

## Fonte e semântica

- Fonte principal: [API pública Obrasgov](https://www.gov.br/obrasgov/pt-br/ferramentas-de-gestao-e-transparencia/api-de-dados-abertos-obrasgov-br_novo), endpoints `projeto-investimento`, `geometria` e consulta por ID. A página oficial confirma acesso aberto, mas não identificamos licença específica da API. A licença MIT do código não é aplicada aos dados.
- Recorte da cidade: correspondência exata do nome de município da geometria e UF principal do projeto. O registro pode se referir a projeto regional, sede ou ponto aproximado. A tabela mostra a associação informada, não um censo de obras fisicamente no município.
- Status e datas são os campos informados na coleta. Previsão vencida não comprova atraso. Data efetiva ausente não vira zero. Datas efetivas da consulta complementar são rotuladas separadamente.
- `investmentTotal` soma apenas valores numéricos de investimentos **previstos**. Não é despesa, pagamento, contrato nem orçamento executado. Valores nulos e zero não entram no indicador de valor positivo. Não são publicadas somas monetárias por cidade.
- IDs únicos, contagem dos blocos, integridade de valores, município/UF e vínculo das dez fichas são validados no gerador. SHA-256 dos arquivos de entrada é apresentado na metodologia.
- O mapa conserva seu snapshot validado; o link `/radar.html?obra={id}` seleciona a mesma entidade ao abrir e recarregar. Mapa e geolocalização continuam opcionais.

## Descoberta, schema e agentes

HTML inicial de cidade e ficha contém resposta curta, tabela ou campos, contexto da cobertura, data e links HTML reais. Cada página distinta tem canonical próprio, título, descrição e H1. O sitemap lista apenas as 22 canônicas; `lastmod` acompanha a coleta ou revisão editorial material. As fichas apontam cidade, fonte e mapa; hubs evitam órfãs.

JSON-LD usa `WebSite` na home, `WebPage` e `BreadcrumbList` nas páginas, `ItemList` nos hubs e associação de fichas, e `Dataset`/`DataDownload` somente em `/dados`. O JSON-LD não contém avaliações, preços, licenças não verificadas ou promessa de rich result. CSV e JSON do piloto têm dicionário de campos, datas, fonte e unidades. `llms.txt` é apenas índice auxiliar público.

`robots.txt` permite Googlebot e OAI-SearchBot por `User-agent: *`; a política de GPTBot não foi alterada. Não há regra específica de CDN visível nesta tarefa para verificar tratamento por identidade de bot. Google informa que recursos de IA não exigem schema ou arquivo especial e que a indexação não é garantida: [AI features](https://developers.google.com/search/docs/appearance/ai-features), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Dataset](https://developers.google.com/search/docs/appearance/structured-data/dataset). A distinção entre OAI-SearchBot e GPTBot segue [a documentação oficial](https://developers.openai.com/api/docs/bots).

## Medição e decisão em 90 dias

O componente GA4 existente é reutilizado com eventos não sensíveis `abrir_ficha`, `explorar_mapa`, `abrir_fonte`, `exportar_dados`, `comparar_cidades` e `abrir_labs`. Não há nova tag. Os eventos não incluem busca, ID, coordenada ou endereço. A instrumentação depende da configuração já existente; relatórios do GA4 não estavam acessíveis para confirmar recebimento. Referers de assistentes, crawlers e pessoas devem ser separados onde houver dados; requests de bot não são sessões.

| Janela | Revisão | Decisão |
| --- | --- | --- |
| 0–28 dias | Crawl, 200/404/canonical, GSC quando disponível, erros de Worker, atualização da fonte, landing pages e eventos | Corrigir exclusões, conteúdo contraditório ou quebra de UX |
| 29–60 dias | Consultas não marca e cliques por família, idade das páginas, uso humano e referências verificáveis | Melhorar respostas com procura observada; ampliar só recortes com dados suficientes |
| 61–90 dias | Comparar janelas de 28 dias, custo de refresh, cobertura, consultas e ações úteis | Manter, ajustar ou interromper expansão; crescimento não é garantido |

O acompanhamento semanal consulta apenas sinais acessíveis. Sem Search Console/GA4 autenticados, registra a lacuna e não cria números substitutos. A revisão final está prevista para 23/12/2026, noventa dias após este release.
