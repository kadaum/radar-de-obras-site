import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.argv[2]||'http://localhost:3005';
const sitemap=fs.readFileSync('public/sitemap.xml','utf8');
const pilots=[...sitemap.matchAll(/<loc>https:\/\/radar-obras\.ricardoguia\.com(\/obras\/[^<]+)<\/loc>/g)].map(x=>x[1]);
const paths=[...pilots,'/obras/44379.35-79','/obras/13421.16-84'];
for(const path of paths){
 const r=await fetch(base+path);assert.equal(r.status,200,path);const html=await r.text();
 const nav=html.match(/<nav class="work-contents"[\s\S]*?<\/nav>/)?.[0];assert.ok(nav,`${path}: SSR navigation`);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
 for(const match of nav.matchAll(/href="#([^"]+)"/g))assert.equal(ids.filter(id=>id===match[1]).length,1,`${path}: unique target ${match[1]}`);
 assert.equal([...html.matchAll(/<h1[ >]/g)].length,1,path);
 assert.ok(html.includes('class="work-overview"'),`${path}: visual summary`);
 assert.ok(html.includes('application/ld+json')&&html.includes('rel="canonical"'),`${path}: metadata`);
 const stack=[];for(const tag of html.matchAll(/<\/?(?:details|section|div)\b[^>]*>/g)){
  const raw=tag[0];if(raw.startsWith('</')){stack.pop();continue;}
  if(/id="(?:sobre|localizacao|contratos-andamento|execucao-fisica|fontes)"/.test(raw))assert.ok(!stack.includes('details'),`${path}: section hidden in disclosure`);
  stack.push(raw.match(/^<(\w+)/)[1]);
 }
 console.log('PASS',path,'SSR section links, unique headings, overview, metadata and visible sections');
}
