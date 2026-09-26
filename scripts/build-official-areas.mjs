import fs from 'node:fs';
import manifest from '../lib/national-manifest.json' with {type:'json'};
import {decodeNationalShard} from '../lib/national-codec.mjs';
import {areaKey,areaSlug} from '../lib/official-areas.mjs';

const groups=new Map();
for(const bucket of manifest.buckets){
 const rows=decodeNationalShard(JSON.parse(fs.readFileSync(`public${manifest.directory}/${bucket}.json`)));
 for(const work of Object.values(rows)){
  for(const name of new Set((work.context?.classification || []).map(entry=>entry.tipo?.trim()).filter(Boolean))){
   const key=areaKey(name);
   if(!groups.has(key))groups.set(key,{label:name,rows:[],states:{}});
   const group=groups.get(key);
   group.rows.push([work.id,work.name,work.city,work.uf,work.status,work.investmentTotal]);
   if(work.uf)group.states[work.uf]=(group.states[work.uf]||0)+1;
  }
 }
}
const directory=`${manifest.directory}/areas`;
fs.mkdirSync(`public${directory}`,{recursive:true});
const entries=[];
for(const group of groups.values()){
 const slug=areaSlug(group.label);
 group.rows.sort((a,b)=>String(a[1]).localeCompare(String(b[1]),'pt-BR')||String(a[0]).localeCompare(String(b[0])));
 const file=`${directory}/${slug}.json`;
 fs.writeFileSync(`public${file}`,JSON.stringify({sourceLoad:manifest.sourceLoad,rows:group.rows}));
 entries.push({slug,label:group.label,count:group.rows.length,states:Object.entries(group.states).sort((a,b)=>b[1]-a[1]),file});
}
entries.sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'pt-BR'));
fs.writeFileSync('lib/official-areas.json',JSON.stringify({sourceLoad:manifest.sourceLoad,total:manifest.total,entries}));
console.log(JSON.stringify({areas:entries.length,classified:entries.reduce((n,x)=>n+x.count,0),directory}));
