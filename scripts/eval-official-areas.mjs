import assert from 'node:assert/strict';
import fs from 'node:fs';
import manifest from '../lib/official-areas.json' with {type:'json'};
import {areaSlug} from '../lib/official-areas.mjs';
const base=process.argv[2]||'http://localhost:3005';
const origin=new URL(base);if(!['localhost','127.0.0.1'].includes(origin.hostname))throw new Error('Local preview only');
assert.equal(manifest.entries.length,24);
assert.equal(new Set(manifest.entries.map(x=>x.slug)).size,24);
assert.equal(areaSlug('Defesa Civil'),areaSlug('Defesa civil'));
for(const area of manifest.entries){const source=JSON.parse(fs.readFileSync(`public${area.file}`));assert.equal(source.sourceLoad,manifest.sourceLoad);assert.equal(source.rows.length,area.count);assert.equal(new Set(source.rows.map(row=>row[0])).size,area.count);}
const request=async path=>{const r=await fetch(base+path);return {status:r.status,text:await r.text()};};
const index=await request('/areas');assert.equal(index.status,200);for(const area of manifest.entries)assert.ok(index.text.includes(`/areas/${area.slug}`));
const education=await request('/areas/educacao');assert.equal(education.status,200);assert.ok(education.text.includes('17.709'));assert.ok(education.text.includes('application/ld+json'));assert.ok(education.text.includes('rel="canonical"'));assert.ok(education.text.includes('/areas/educacao?pagina=2'));
const second=await request('/areas/educacao?pagina=2');assert.equal(second.status,200);assert.ok(second.text.includes('noindex'));assert.match(second.text,/página 2 de \d+/);
const filtered=await request('/areas/educacao?uf=SP&q=Pirituba');assert.equal(filtered.status,200);assert.ok(filtered.text.includes('4902.35-23'));assert.ok(filtered.text.includes('noindex'));
const unknown=await request('/areas/nao-existe');assert.equal(unknown.status,404);
const outOfRange=await request('/areas/educacao?pagina=99999');assert.equal(outOfRange.status,404);
const work=await request('/obras/4902.35-23/restaurante-estudantil-campus-pirituba');assert.equal(work.status,200);assert.ok(work.text.includes('/areas/educacao'));assert.ok(work.text.includes('Compartilhar'));assert.ok(work.text.includes('Veja também'));assert.ok(work.text.includes('id="veja-tambem"'));assert.ok(work.text.includes('/obras/44379.35-79'));
const sitemap=fs.readFileSync('public/sitemap-areas.xml','utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,25);assert.ok(fs.readFileSync('public/sitemap-index.xml','utf8').includes('/sitemap-areas.xml'));
console.log('PASS: 24 official areas, complete source membership, pagination/search, canonical/noindex, internal links, nearby recommendations and sitemap');


