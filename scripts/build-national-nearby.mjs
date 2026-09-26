import fs from 'node:fs';
import path from 'node:path';
const snapshot=JSON.parse(fs.readFileSync('public/data/projects-manifest.json','utf8'));
const national=JSON.parse(fs.readFileSync('lib/national-manifest.json','utf8'));
const rows=snapshot.files.flatMap(f=>JSON.parse(fs.readFileSync(`public${f.url}`,'utf8')));
const groups=new Map(),cells=new Map();
for(const row of rows){if(!row.point)continue;const key=row.point.join(',');if(!groups.has(key)){const group={point:row.point,ids:[]};groups.set(key,group);const cell=row.point.map(v=>Math.floor(v*10)).join(',');if(!cells.has(cell))cells.set(cell,[]);cells.get(cell).push(group);}groups.get(key).ids.push(row.id);}
for(const group of groups.values())group.ids.sort();
const radians=Math.PI/180;
export function distance(a,b){const x=Math.sin((b[1]-a[1])*radians/2)**2+Math.cos(a[1]*radians)*Math.cos(b[1]*radians)*Math.sin((b[0]-a[0])*radians/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(Math.max(0,1-x)));}
const shards=new Map(national.buckets.map(b=>[b,{}]));let linked=0,edges=0;
for(const group of groups.values()){
 const [x,y]=group.point.map(v=>Math.floor(v*10));const candidates=[];
 // A 5 km radius fits inside adjacent 0.1 degree cells across Brazil's latitudes.
 for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const other of cells.get(`${x+dx},${y+dy}`)||[]){const km=distance(group.point,other.point);if(km<=5)for(const id of other.ids.slice(0,4))candidates.push([id,km]);}
 candidates.sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0]));
 for(const id of group.ids){const neighbors=candidates.filter(x=>x[0]!==id).slice(0,3);if(neighbors.length){shards.get(Math.floor(Number(id.split('.')[0])/1000))[id]=neighbors;linked++;edges+=neighbors.length;}}
}
let bytes=0;
for(const [bucket,neighbors] of shards){const target=`public${national.directory}/nearby-${bucket}.json`;fs.mkdirSync(path.dirname(target),{recursive:true});const body=JSON.stringify({sourceLoad:snapshot.meta.sourceLoad,neighbors});fs.writeFileSync(target,body);bytes+=Buffer.byteLength(body);}
console.log(JSON.stringify({projects:rows.length,withPoint:rows.filter(x=>x.point).length,linked,edges,bytes}));
