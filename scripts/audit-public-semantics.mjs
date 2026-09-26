import fs from 'node:fs';
import manifest from '../lib/national-manifest.json' with {type:'json'};
import {decodeNationalShard} from '../lib/national-codec.mjs';
import {indexableNationalWork} from '../lib/national-eligibility.mjs';
const origin='https://radar-obras.ricardoguia.com';
const base=process.argv[2]||origin;
const paths=[...fs.readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>new URL(x[1]).pathname);
for(let i=0;i<manifest.buckets.length;i+=17){const rows=Object.values(decodeNationalShard(JSON.parse(fs.readFileSync(`public${manifest.directory}/${manifest.buckets[i]}.json`))));const row=rows.find(indexableNationalWork);if(row)paths.push(`/obras/${row.id}`);}
const attr=(tag,key)=>tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1];
const results=[];let cursor=0;
await Promise.all(Array.from({length:3},async()=>{while(cursor<paths.length){const path=paths[cursor++];const errors=[];try{
 const response=await fetch(base+path,{signal:AbortSignal.timeout(30000)});const html=await response.text();
 if(response.status!==200)errors.push(`HTTP ${response.status}`);
 const titles=[...html.matchAll(/<title>([\s\S]*?)<\/title>/g)];if(titles.length!==1||!titles[0][1].trim())errors.push('title');
 const meta=[...html.matchAll(/<meta\b[^>]*>/g)].map(x=>x[0]);
 const descriptions=meta.filter(x=>attr(x,'name')==='description');if(descriptions.length!==1||!attr(descriptions[0],'content'))errors.push('description');
 const canon=[...html.matchAll(/<link\b[^>]*>/g)].map(x=>x[0]).filter(x=>attr(x,'rel')==='canonical');if(canon.length!==1||new URL(attr(canon[0],'href')||base).href!==origin+new URL(response.url).pathname)errors.push('canonical');
 if([...html.matchAll(/<h1\b/g)].length!==1)errors.push('H1');
 if(!/<html[^>]*lang="pt-BR"/.test(html))errors.push('language');
 const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(x=>JSON.parse(x[1]));
 if(!schemas.length)errors.push('missing JSON-LD');
 for(const schema of schemas){if(schema['@context']!=='https://schema.org'||!schema['@type'])errors.push('schema envelope');if(schema['@type']==='BreadcrumbList'&&schema.itemListElement.some((x,i)=>x.position!==i+1||!x.name||!x.item?.startsWith(origin)))errors.push('breadcrumb');}
 const images=[...html.matchAll(/<img\b[^>]*>/g)].map(x=>x[0]);for(const img of images)if(attr(img,'alt')===undefined||!attr(img,'width')||!attr(img,'height'))errors.push('image alt/dimensions');
 results.push({path,status:response.status,title:titles[0]?.[1],description:attr(descriptions[0]||'','content'),schemas:schemas.map(x=>x['@type']),images:images.length,errors});
 }catch(error){results.push({path,errors:[String(error)]});}}}));
const report={checkedAt:new Date().toISOString(),base,scope:'All core sitemap pages plus systematic national shard sample; raw HTTP HTML, no JavaScript execution. Not a rich-results validator, ranking assessment or exhaustive national render audit.',checked:results.length,failures:results.filter(x=>x.errors.length),results};
fs.mkdirSync('.sites-runtime',{recursive:true});fs.writeFileSync('.sites-runtime/public-semantics-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify({checked:report.checked,failures:report.failures}));if(report.failures.length)process.exitCode=1;
