import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import snapshot from '../lib/organic-data.json' with {type:'json'};
import details from '../lib/organic-details.json' with {type:'json'};

const base=process.argv[2]||'http://localhost:3002';
const origin='https://radar-obras.ricardoguia.com';
const sitemap=fs.readFileSync('public/sitemap.xml','utf8');
const csv=fs.readFileSync('public/dados/piloto-obras.csv','utf8');
const overview=JSON.parse(fs.readFileSync('public/data/map-overview.json','utf8'));
const slugs={
 '128622.33-16':'reforma-pavilhao-rocha-lima-fiocruz','7207.33-55':'redes-esgoto-aguas-pluviais-hospital-bonsucesso',
 '4902.35-23':'restaurante-estudantil-campus-pirituba','59693.35-95':'reforma-hospital-ruminantes-usp',
 '45919.31-65':'anexo-escola-enfermagem-ufmg','92142.31-00':'manutencao-casa-conde-santa-marinha',
 '45892.29-61':'escola-de-musica-ufba-segunda-etapa','60185.29-20':'recuperacao-fachadas-fiocruz-bahia',
 '30125.26-63':'prevencao-incendio-hospital-clinicas-pe','41201.26-60':'residenciais-aeronautica-recife',
};
const cityPath=city=>`/cidades/${city.uf.toLowerCase()}/${city.slug}`;
const workPath=id=>`/obras/${id}/${slugs[id]}`;
const fetchPage=async path=>{const response=await fetch(`${base}${path}`);return {response,html:await response.text()}};
const canonical=html=>html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1]||html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/)?.[1];
const schemas=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));

void test('input identity, city scope, exports and sitemap match validated snapshot',()=>{
 const ids=new Set();for(const city of snapshot.cities){assert.ok(city.rows.length>100);for(const row of city.rows){assert.equal(row.city,city.name);assert.equal(row.uf,city.uf);assert.ok(!ids.has(row.id));ids.add(row.id);}for(const id of city.ids){assert.ok(city.rows.some(row=>row.id===id));assert.ok(details[id]);assert.ok(sitemap.includes(`${origin}${workPath(id)}`));}}
 assert.equal(Object.keys(details).length,10);assert.equal(csv.trim().split(/\r?\n/).length,11);
 assert.equal([...sitemap.matchAll(/<url>/g)].length,22);
 assert.equal(overview.total,snapshot.source.sourceTotal);
 assert.equal(overview.featureCollection.features.reduce((count,feature)=>count+feature.properties.count,0),overview.withPoint);
 assert.ok(overview.withPoint>0&&overview.withPoint<=overview.total);
});
void test('city pages serve specific HTML, self-canonical, real links and factual counts without JS',async()=>{
 for(const city of snapshot.cities){const path=cityPath(city);const {response,html}=await fetchPage(path);
  assert.equal(response.status,200,path);assert.ok(html.includes('<table'),path);assert.ok(html.includes(`${city.rows.length.toLocaleString('pt-BR')} registros`),path);
  assert.equal(canonical(html),`${origin}${path}`);assert.ok(html.includes(workPath(city.ids[0])));assert.ok(html.includes('/metodologia'));
  const parsed=schemas(html);assert.ok(parsed.some(item=>item['@type']==='WebPage'&&item.url===`${origin}${path}`));
 }
});
void test('ten fichas serve source and distinct canonical with snapshot values',async()=>{
 for(const city of snapshot.cities){for(const id of city.ids){const path=workPath(id);const row=city.rows.find(item=>item.id===id);const {response,html}=await fetchPage(path);
  assert.equal(response.status,200,path);assert.equal(canonical(html),`${origin}${path}`);assert.ok(html.includes(id));assert.ok(html.includes(row.status));assert.ok(html.includes(row.organization));assert.ok(html.includes(`/radar.html?obra=${id}`));assert.ok(html.includes('api-publica.obrasgov.gestao.gov.br'));
  assert.ok(html.includes(cityPath(city)));assert.ok(schemas(html).some(item=>item['@type']==='WebPage'&&item.url===`${origin}${path}`));
 }}
});
void test('filters remain nonindexable, preserve canonical, and 404 nonexistent entities',async()=>{
 const path='/cidades/rj/rio-de-janeiro';const {html}=await fetchPage(`${path}?q=128622.33-16`);
 assert.match(html,/1(?:<!-- -->)? resultado\(s\)/);assert.equal(canonical(html),`${origin}${path}`);assert.match(html,/<meta[^>]+name="robots"[^>]+noindex/);
 for(const invalid of ['/cidades/xx/nenhuma','/obras/sem-id/falso','/obras/128622.33-16/slug-errado',`${path}?pagina=9999`])assert.equal((await fetch(`${base}${invalid}`)).status,404,invalid);
});
void test('data page has factual Dataset distributions and public downloads',async()=>{
 const {response,html}=await fetchPage('/dados');assert.equal(response.status,200);
 const dataset=schemas(html).find(item=>item['@type']==='Dataset');assert.ok(dataset);assert.equal(dataset.distribution.length,2);
 for(const item of dataset.distribution){const url=new URL(item.contentUrl);const result=await fetch(`${base}${url.pathname}`);assert.equal(result.status,200);assert.ok((await result.text()).includes('128622.33-16'));}
});
