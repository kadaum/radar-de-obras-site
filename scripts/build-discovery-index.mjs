import fs from 'node:fs';
import snapshot from '../lib/organic-data.json' with {type:'json'};
import details from '../lib/organic-details.json' with {type:'json'};

const origin='https://radar-obras.ricardoguia.com';
const slugs={
  '128622.33-16':'reforma-pavilhao-rocha-lima-fiocruz','7207.33-55':'redes-esgoto-aguas-pluviais-hospital-bonsucesso',
  '4902.35-23':'restaurante-estudantil-campus-pirituba','59693.35-95':'reforma-hospital-ruminantes-usp',
  '45919.31-65':'anexo-escola-enfermagem-ufmg','92142.31-00':'manutencao-casa-conde-santa-marinha',
  '45892.29-61':'escola-de-musica-ufba-segunda-etapa','60185.29-20':'recuperacao-fachadas-fiocruz-bahia',
  '30125.26-63':'prevencao-incendio-hospital-clinicas-pe','41201.26-60':'residenciais-aeronautica-recife',
};
const editorialLastmod='2026-09-24'; // Bump only after a material editorial change.
const workEditorialLastmod='2026-09-25'; // Fichas: classification, contractor identity and progressive disclosure.
const cityLastmod=snapshot.source.investmentCollectedAt.slice(0,10);
const urls=[['/',editorialLastmod],['/cidades',editorialLastmod],['/obras',editorialLastmod],['/metodologia',editorialLastmod],['/guia-de-interpretacao',editorialLastmod],['/dados',editorialLastmod],['/levantamento',editorialLastmod]];
for(const row of urls)if(['/obras','/metodologia'].includes(row[0]))row[1]='2026-09-26';
for(const city of snapshot.cities){
  urls.push([`/cidades/${city.uf.toLowerCase()}/${city.slug}`,cityLastmod]);
  for(const id of city.ids) urls.push([`/obras/${encodeURIComponent(id)}/${slugs[id]}`,[details[id].checkedAt.slice(0,10),workEditorialLastmod].sort((a,b)=>a.localeCompare(b)).at(-1)]);
}
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([path,lastmod])=>`  <url><loc>${origin}${path}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync('public/sitemap.xml',xml);
fs.writeFileSync('public/llms.txt',`# Radar de Obras\n\nLeitura independente de registros da API pública Obrasgov. A cobertura descreve o cadastro consultado, não todas as obras do Brasil. Valores são investimentos previstos; situação e datas são informadas pela fonte.\n\n- [Cidades](${origin}/cidades): cinco recortes piloto.\n- [Fichas de obras](${origin}/obras): fichas do cadastro nacional e uma seleção de dez projetos com contexto adicional. Fichas nacionais seguem /obras/{id}; os projetos selecionados também usam um slug, com redirecionamento canônico.\n- [Metodologia](${origin}/metodologia): coleta, cobertura, validação, classificação derivada e limites.\n- [Guia de interpretação](${origin}/guia-de-interpretacao): situação, previsão, valor e localização.\n- [Dados e downloads](${origin}/dados): CSV e JSON das dez fichas, com dicionário.\n- [Levantamento](${origin}/levantamento): comparação dos cinco recortes.\n- [Índice de sitemaps](${origin}/sitemap-index.xml): páginas editoriais e fichas nacionais elegíveis.\n\nAs fichas entregam texto, classificação oficial, responsáveis e fontes em HTML. Seções expansíveis preservam o conteúdo no HTML. Tipo identificado no título é uma indicação derivada por regras fixas, separada da taxonomia oficial; não confirma entrega, funcionamento ou escopo completo. A data do cadastro e a data da consulta complementar são distintas. Consulta indisponível não comprova ausência de contrato ou medição. Executor e tomador não identificam necessariamente a empresa contratada. Investimento previsto, valor contratual e pagamento são medidas diferentes. População e empregos são números declarados sem confirmação independente. Não há avaliação publicada de sobrepreço.\n\nFonte oficial: https://www.gov.br/obrasgov/pt-br/ferramentas-de-gestao-e-transparencia/api-de-dados-abertos-obrasgov-br_novo\n`);
console.log(`Wrote ${urls.length} canonical URLs`);

