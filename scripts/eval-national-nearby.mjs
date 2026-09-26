import fs from 'node:fs';
import assert from 'node:assert/strict';
import snapshot from '../public/data/projects-manifest.json' with {type:'json'};
import manifest from '../lib/national-manifest.json' with {type:'json'};
const rows=snapshot.files.flatMap(f=>JSON.parse(fs.readFileSync(`public${f.url}`,'utf8'))),byId=new Map(rows.map(r=>[r.id,r]));
const stored={};let edges=0;
for(const bucket of manifest.buckets){const shard=JSON.parse(fs.readFileSync(`public${manifest.directory}/nearby-${bucket}.json`));assert.equal(shard.sourceLoad,manifest.sourceLoad);Object.assign(stored,shard.neighbors);for(const [id,neighbors] of Object.entries(shard.neighbors)){assert.ok(byId.get(id)?.point);assert.ok(neighbors.length<=3);assert.equal(new Set(neighbors.map(x=>x[0])).size,neighbors.length);for(const [other,km] of neighbors){assert.notEqual(other,id);assert.ok(byId.get(other)?.point);assert.ok(km>=0&&km<=5);edges++;}}}
const valid=rows.filter(r=>r.point);
const sample=valid.filter((_,i)=>i%5000===0);
for(const axis of [0,1]){sample.push(valid.reduce((a,b)=>a.point[axis]<b.point[axis]?a:b),valid.reduce((a,b)=>a.point[axis]>b.point[axis]?a:b));}
function greatCircle(a,b){const rad=Math.PI/180,dlat=(b[1]-a[1])*rad,dlon=(b[0]-a[0])*rad;return 12742*Math.asin(Math.min(1,Math.sqrt(Math.sin(dlat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(dlon/2)**2)));}
for(const row of sample){const expected=valid.filter(r=>r.id!==row.id).map(r=>[r.id,greatCircle(row.point,r.point)]).filter(x=>x[1]<=5).sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0])).slice(0,3);const actual=stored[row.id]||[];assert.deepEqual(actual.map(x=>x[0]),expected.map(x=>x[0]),row.id);actual.forEach((x,i)=>assert.ok(Math.abs(x[1]-expected[i][1])<1e-6));}
console.log(JSON.stringify({allEdgesValidated:edges,linked:Object.keys(stored).length,bruteForceCases:sample.length,passed:true}));
