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
const cityLastmod=snapshot.source.investmentCollectedAt.slice(0,10);
const urls=[['/',editorialLastmod],['/cidades',editorialLastmod],['/obras',editorialLastmod],['/metodologia',editorialLastmod],['/guia-de-interpretacao',editorialLastmod],['/dados',editorialLastmod],['/levantamento',editorialLastmod]];
for(const city of snapshot.cities){
  urls.push([`/cidades/${city.uf.toLowerCase()}/${city.slug}`,cityLastmod]);
  for(const id of city.ids) urls.push([`/obras/${encodeURIComponent(id)}/${slugs[id]}`,details[id].checkedAt.slice(0,10)]);
}
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([path,lastmod])=>`  <url><loc>${origin}${path}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync('public/sitemap.xml',xml);
fs.writeFileSync('public/llms.txt',`# Radar de Obras\n\nLeitura independente de registros da API pública Obrasgov. A cobertura descreve o cadastro consultado, não todas as obras do Brasil. Valores são investimentos previstos; situação e datas são informadas pela fonte.\n\n- [Cidades](${origin}/cidades): cinco recortes piloto.\n- [Fichas de obras](${origin}/obras): dez projetos com ID e fonte oficial.\n- [Metodologia](${origin}/metodologia): coleta, cobertura, validação e limites.\n- [Guia de interpretação](${origin}/guia-de-interpretacao): como ler situação, previsão, valor e localização.\n- [Dados e downloads](${origin}/dados): CSV e JSON das dez fichas, com dicionário.\n- [Levantamento](${origin}/levantamento): comparação reproduzível dos cinco recortes.\n- [Sitemap](${origin}/sitemap.xml).\n\nFonte oficial: https://www.gov.br/obrasgov/pt-br/ferramentas-de-gestao-e-transparencia/api-de-dados-abertos-obrasgov-br_novo\n`);
console.log(`Wrote ${urls.length} canonical URLs`);
