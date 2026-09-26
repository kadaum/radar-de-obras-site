import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import manifest from '../lib/national-manifest.json' with {type:'json'};
import snapshot from '../public/data/projects-manifest.json' with {type:'json'};
import pilot from '../lib/organic-details.json' with {type:'json'};
import {indexableNationalWork} from '../lib/national-eligibility.mjs';
import {decodeNationalShard} from '../lib/national-codec.mjs';
const base=process.argv[2]||'http://localhost:3004';
void test('national shards preserve every published record exactly',()=>{
 const rows=new Map();for(const bucket of manifest.buckets){const context=JSON.parse(fs.readFileSync(`source-data/context/${bucket}.json`));for(const row of Object.values(decodeNationalShard(JSON.parse(fs.readFileSync(`public${manifest.directory}/${bucket}.json`))))){assert.ok(!rows.has(row.id));assert.deepEqual(row.context,context[row.id]);rows.set(row.id,row);}}
 assert.equal(rows.size,snapshot.total);
 for(const file of snapshot.files)for(const row of JSON.parse(fs.readFileSync(`public${file.url}`))){const {context,...base}=rows.get(row.id);assert.deepEqual(base,row);assert.ok(Array.isArray(context.classification));}
});
void test('national HTML answers core questions without JS or the upstream API',async()=>{
 for(const id of ['44379.35-79','151020.43-16']){
  const response=await fetch(`${base}/obras/${id}`);assert.equal(response.status,200);
  const html=await response.text();assert.ok(html.includes(id));
  assert.ok(html.includes(`https://radar-obras.ricardoguia.com/obras/${id}`));
  for(const label of ['Situação informada','Investimento previsto','Organização responsável','Fonte e atualização','Classificação oficial','Eixo, tipo e subtipo oficiais','Quem administra, repassa e responde pela execução','Contratos, andamento e recursos','Explorar esta região no mapa'])assert.ok(html.includes(label));
  assert.match(html,/<title>[^<]+Radar de Obras/);assert.match(html,/<h1>/);
  assert.ok(html.includes('application/ld+json'));
 }
 const invalid=await fetch(`${base}/obras/999999999.00-00`);assert.equal(invalid.status,404);
 const pilot=await fetch(`${base}/obras/4902.35-23`,{redirect:'manual'});assert.equal(pilot.status,308);assert.ok(pilot.headers.get('location').endsWith('/restaurante-estudantil-campus-pirituba'));
});
void test('reported impact remains attributed and secondary, including implausible source values',async()=>{
 const response=await fetch(`${base}/obras/13421.16-84`);assert.equal(response.status,200);
 const html=await response.text();
 const impact=html.match(/<div class="impact-panel"><h3>População e empregos declarados<\/h3>[\s\S]*?Não usamos esses números[\s\S]*?<\/p><\/div>/)?.[0];
 assert.ok(impact);assert.ok(impact.includes('1.213.647.762'));assert.ok(impact.includes('erros de escala'));
 assert.ok(impact.includes('Valor atípico — requer verificação'));assert.ok(impact.includes('não prova de erro'));
 assert.ok(!html.match(/<header[\s\S]*?<\/header>/)?.[0].includes('1.213.647.762'));
 assert.ok(html.includes('© OpenStreetMap contributors'));
 const hub=await (await fetch(`${base}/obras`)).text();assert.ok(hub.includes('Buscar na lista nacional'));assert.ok(hub.includes(snapshot.total.toLocaleString('pt-BR')));
 const llms=await (await fetch(`${base}/llms.txt`)).text();assert.ok(llms.includes('/sitemap-index.xml'));assert.ok(!llms.includes('dez projetos com ID'));
});
void test('national sitemap matches completeness policy for every record',()=>{
 const index=fs.readFileSync('public/sitemap-index.xml','utf8');
 const paths=[...index.matchAll(/<loc>https:\/\/radar-obras\.ricardoguia\.com([^<]+)<\/loc>/g)].map(x=>x[1]);
 const published=new Set();
 for(const path of paths.filter(x=>/^\/sitemap-obras-\d+\.xml$/.test(x))){
  const xml=fs.readFileSync(`public${path}`,'utf8');const entries=[...xml.matchAll(/<loc>https:\/\/radar-obras\.ricardoguia\.com\/obras\/([^<]+)<\/loc>/g)].map(x=>x[1]);
  assert.ok(entries.length<=50000);assert.ok(Buffer.byteLength(xml)<50*1024*1024);
  for(const id of entries){assert.ok(!published.has(id));published.add(id);}
 }
 let expected=0;
 for(const bucket of manifest.buckets)for(const row of Object.values(decodeNationalShard(JSON.parse(fs.readFileSync(`public${manifest.directory}/${bucket}.json`))))){
  const eligible=!pilot[row.id]&&indexableNationalWork(row);assert.equal(published.has(row.id),eligible,row.id);if(eligible)expected++;
 }
 assert.equal(published.size,expected);assert.ok(fs.readFileSync('public/robots.txt','utf8').includes('/sitemap-index.xml'));
});

