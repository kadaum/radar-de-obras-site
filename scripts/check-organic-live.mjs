// Read-only weekly health check. Run after publish or from the 90-day heartbeat.
import fs from 'node:fs';
const origin = 'https://radar-obras.ricardoguia.com';
const api = 'https://api-publica.obrasgov.gestao.gov.br/obras/data-atualizacao';
const manifest = JSON.parse(fs.readFileSync('public/data/projects-manifest.json', 'utf8'));
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
let cursor = 0;
const checked = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < paths.length) {
    const path = paths[cursor++];
    try {
      const { body } = await get(origin + path);
      const canonical = `${origin}${path}`;
      if (!body.includes(`href="${canonical}"`)) failures.push({ path, issue: 'canonical missing' });
      if (!body.includes('<h1')) failures.push({ path, issue: 'H1 missing' });
      checked.push(path);
    } catch (error) { failures.push({ path, issue: String(error) }); }
  }
}));
for (const path of ['/sitemap.xml', '/robots.txt', '/llms.txt', '/dados/piloto-obras.csv', '/dados/piloto-obras.json']) {
  try { await get(origin + path); checked.push(path); }
  catch (error) { failures.push({ path, issue: String(error) }); }
}
let sourceLoad = null, sourceError = null;
try { sourceLoad = JSON.parse((await get(api)).body).data_ultima_atualizacao ?? null; }
catch (error) { sourceError = String(error); }
const report = { checkedAt: new Date().toISOString(), domain: origin, checked: checked.length, failures,
  publishedSourceLoad: manifest.meta.sourceLoad, currentSourceLoad: sourceLoad,
  refreshNeeded: !!sourceLoad && sourceLoad !== manifest.meta.sourceLoad, sourceError };
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
