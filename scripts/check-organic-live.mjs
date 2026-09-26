// Read-only weekly health check. Run after publish or from the 90-day heartbeat.
import fs from 'node:fs';
import {decodeNationalShard} from '../lib/national-codec.mjs';
const origin = 'https://radar-obras.ricardoguia.com';
const base = process.argv[2] || origin;
const api = 'https://api-publica.obrasgov.gestao.gov.br/obras/data-atualizacao';
const manifest = JSON.parse(fs.readFileSync('public/data/projects-manifest.json', 'utf8'));
const enrichment = JSON.parse(fs.readFileSync('lib/work-enrichment.json', 'utf8'));
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const paths = [...sitemap.matchAll(/<loc>https:\/\/radar-obras\.ricardoguia\.com([^<]*)<\/loc>/g)].map(match => match[1]);
if (paths.length !== 22 || new Set(paths).size !== paths.length) throw new Error(`Unexpected sitemap URL count: ${paths.length}`);

async function get(url) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'cache-control': 'no-cache' }, signal: AbortSignal.timeout(20000) });
      const body = await response.text();
      if (response.ok) return { status: response.status, body };
      last = new Error(`HTTP ${response.status}`);
    } catch (error) { last = error; }
  }
  throw last;
}

const failures = [];
if (enrichment.sourceLoad !== manifest.meta.sourceLoad || Object.keys(enrichment.projects).length !== 10)
  failures.push({ path: '/obras', issue: 'enriched fichas and validated manifest differ' });
let cursor = 0;
const checked = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < paths.length) {
    const path = paths[cursor++];
    try {
      const { body } = await get(base + path);
      const canonical = `${origin}${path}`;
      const homeWithoutSlash = path === '/' && body.includes(`href="${origin}"`);
      if (!body.includes(`href="${canonical}"`) && !homeWithoutSlash) failures.push({ path, issue: 'canonical missing' });
      if (!body.includes('<h1')) failures.push({ path, issue: 'H1 missing' });
      if (path === '/' && (!body.includes('/favicon.svg?v=2') || !body.includes('/apple-touch-icon.png?v=2')))
        failures.push({ path, issue: 'branded icons missing from homepage' });
      if (path.startsWith('/obras/') && !body.includes('O que o projeto pretende entregar'))
        failures.push({ path, issue: 'enriched content missing' });
      if (path.startsWith('/obras/4902.35-23/') && !body.includes('O restaurante já foi inaugurado?'))
        failures.push({ path, issue: 'source discrepancy missing' });
      checked.push(path);
    } catch (error) { failures.push({ path, issue: String(error) }); }
  }
}));
for (const path of ['/radar.html', '/sitemap.xml', '/sitemap-index.xml', '/robots.txt', '/llms.txt', '/dados/piloto-obras.csv', '/dados/piloto-obras.json', '/favicon.svg', '/favicon.ico', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest', '/og-radar.png']) {
  try {
    const { body } = await get(base + path);
    if (path === '/radar.html' && !body.includes('/favicon.svg?v=2')) failures.push({ path, issue: 'branded icon missing from map' });
    if (path === '/favicon.svg' && !body.includes('#203228')) failures.push({ path, issue: 'unexpected favicon' });
    if (path === '/manifest.webmanifest' && !body.includes('/icon-192.png?v=2')) failures.push({ path, issue: 'install icon missing from manifest' });
    checked.push(path);
  }
  catch (error) { failures.push({ path, issue: String(error) }); }
}
// Sample national routes and every referenced sitemap, without crawling 153k pages.
const national=JSON.parse(fs.readFileSync('lib/national-manifest.json','utf8'));
for(const bucket of [national.buckets[0],national.buckets[Math.floor(national.buckets.length/2)],national.buckets.at(-1)]){
 const row=Object.values(decodeNationalShard(JSON.parse(fs.readFileSync(`public${national.directory}/${bucket}.json`)))).find(x=>!enrichment.projects[x.id]);
 if(!row)continue;
 const path=`/obras/${row.id}`;
 try{const {body}=await get(base+path);checked.push(path);for(const marker of [row.id,`href="${origin}${path}"`,'Resumo do cadastro','Fonte e atualização','application/ld+json'])if(!body.includes(marker))failures.push({path,issue:`national content missing: ${marker}`});}
 catch(error){failures.push({path,issue:String(error)});}
}
try{
 const remoteIndex=(await get(base+'/sitemap-index.xml')).body;
 const expected=fs.readFileSync('public/sitemap-index.xml','utf8');
 if(remoteIndex!==expected)failures.push({path:'/sitemap-index.xml',issue:'sitemap index differs from source'});
 for(const match of expected.matchAll(/<loc>https:\/\/radar-obras\.ricardoguia\.com(\/sitemap-obras-\d+\.xml)<\/loc>/g)){
  const path=match[1],body=(await get(base+path)).body;checked.push(path);
  if(body!==fs.readFileSync(`public${path}`,'utf8'))failures.push({path,issue:'sitemap differs from source'});
 }
}catch(error){failures.push({path:'/sitemap-index.xml',issue:String(error)});}
try {
  const liveOverview = JSON.parse((await get(base + '/data/map-overview.json')).body);
  checked.push('/data/map-overview.json');
  const represented = liveOverview.featureCollection.features.reduce((sum, feature) => sum + feature.properties.count, 0);
  if (liveOverview.total !== manifest.total || represented !== liveOverview.withPoint || liveOverview.sourceLoad !== manifest.meta.sourceLoad)
    failures.push({ path: '/data/map-overview.json', issue: 'overview and validated manifest differ' });
} catch (error) { failures.push({ path: '/data/map-overview.json', issue: String(error) }); }
let sourceLoad = null, sourceError = null;
try { sourceLoad = JSON.parse((await get(api)).body).data_ultima_atualizacao ?? null; }
catch (error) { sourceError = String(error); }
const report = { checkedAt: new Date().toISOString(), domain: base, checked: checked.length, failures,
  publishedSourceLoad: manifest.meta.sourceLoad, currentSourceLoad: sourceLoad,
  refreshNeeded: !!sourceLoad && sourceLoad !== manifest.meta.sourceLoad, sourceError };
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
