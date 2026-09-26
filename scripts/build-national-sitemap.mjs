import fs from 'node:fs';
import manifest from '../lib/national-manifest.json' with {type:'json'};
import pilot from '../lib/organic-details.json' with {type:'json'};
import {indexableNationalWork} from '../lib/national-eligibility.mjs';
import {decodeNationalShard} from '../lib/national-codec.mjs';
const origin='https://radar-obras.ricardoguia.com';
const paths=[];
for(const bucket of manifest.buckets){const rows=decodeNationalShard(JSON.parse(fs.readFileSync(`public${manifest.directory}/${bucket}.json`)));for(const row of Object.values(rows))if(!pilot[row.id]&&indexableNationalWork(row))paths.push(`/obras/${row.id}`);}
// A collection timestamp does not establish when this page materially changed.
// Omit optional lastmod until per-page change history covers rendered content.
fs.mkdirSync('public/sitemaps',{recursive:true});const files=[];
for(let start=0;start<paths.length;start+=40000){const name=`/sitemaps/obras-${files.length+1}.xml`;files.push(name);fs.writeFileSync(`public${name}`,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.slice(start,start+40000).map(p=>`<url><loc>${origin}${p}</loc></url>`).join('\n')}\n</urlset>`);}
fs.writeFileSync('public/sitemap-index.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/sitemap.xml',...files].map(p=>`<sitemap><loc>${origin}${p}</loc></sitemap>`).join('\n')}\n</sitemapindex>`);
console.log(JSON.stringify({nationalIndexable:paths.length,sitemaps:files.length}));
