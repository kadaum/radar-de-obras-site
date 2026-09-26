import fs from 'node:fs';
import manifest from '../lib/national-manifest.json' with {type:'json'};
import pilot from '../lib/organic-details.json' with {type:'json'};
import {indexableNationalWork} from '../lib/national-eligibility.mjs';
import {decodeNationalShard} from '../lib/national-codec.mjs';
import areas from '../lib/official-areas.json' with {type:'json'};
const origin='https://radar-obras.ricardoguia.com';
const paths=[];
for(const bucket of manifest.buckets){const rows=decodeNationalShard(JSON.parse(fs.readFileSync(`public${manifest.directory}/${bucket}.json`)));for(const row of Object.values(rows))if(!pilot[row.id]&&indexableNationalWork(row))paths.push(`/obras/${row.id}`);}
// A collection timestamp does not establish when this page materially changed.
// Omit optional lastmod until per-page change history covers rendered content.
// Sitemaps at the host root can list /obras/ URLs without directory-scope ambiguity.
for(const name of fs.readdirSync('public').filter(name=>/^sitemap-obras-\d+\.xml$/.test(name)))fs.rmSync(`public/${name}`);
if(fs.existsSync('public/sitemaps'))for(const name of fs.readdirSync('public/sitemaps').filter(name=>/^obras-\d+\.xml$/.test(name)))fs.rmSync(`public/sitemaps/${name}`);
const files=[];
const areaPaths=['/areas',...areas.entries.map(area=>`/areas/${area.slug}`)];
fs.writeFileSync('public/sitemap-areas.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${areaPaths.map(p=>`<url><loc>${origin}${p}</loc></url>`).join('\n')}\n</urlset>`);
for(let start=0;start<paths.length;start+=40000){const name=`/sitemap-obras-${files.length+1}.xml`;files.push(name);fs.writeFileSync(`public${name}`,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.slice(start,start+40000).map(p=>`<url><loc>${origin}${p}</loc></url>`).join('\n')}\n</urlset>`);}
fs.writeFileSync('public/sitemap-index.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/sitemap.xml','/sitemap-areas.xml',...files].map(p=>`<sitemap><loc>${origin}${p}</loc></sitemap>`).join('\n')}\n</sitemapindex>`);
console.log(JSON.stringify({nationalIndexable:paths.length,sitemaps:files.length}));
