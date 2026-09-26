import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {encodeNationalShard} from '../lib/national-codec.mjs';

// A request loads one bounded shard, never the entire national database.
const manifest=JSON.parse(fs.readFileSync('public/data/projects-manifest.json'));
// Context is a build input, not a second public copy of every description.
if(fs.existsSync('public/data/context/manifest.json')){
 const incoming=JSON.parse(fs.readFileSync('public/data/context/manifest.json'));
 if(incoming.sourceLoad!==manifest.meta.sourceLoad||incoming.total!==manifest.total)throw new Error('Incoming context mismatch');
 fs.mkdirSync('source-data',{recursive:true});
 if(fs.existsSync('source-data/context')){
  fs.mkdirSync('.sites-runtime',{recursive:true});
  fs.renameSync('source-data/context',`.sites-runtime/context-backup-${Date.now()}`);
 }
 fs.renameSync('public/data/context','source-data/context');
}
const contextManifest=JSON.parse(fs.readFileSync('source-data/context/manifest.json'));
if(contextManifest.sourceLoad!==manifest.meta.sourceLoad||contextManifest.total!==manifest.total)throw new Error('National context does not match snapshot');
const buckets=new Map();const ids=new Set();const digest=createHash('sha256');
digest.update('radar-fiches-v3');
for(const file of manifest.files){
 const bytes=fs.readFileSync(path.join('public',file.url));digest.update(bytes);
 const rows=JSON.parse(bytes);if(rows.length!==file.rows)throw new Error('Shard count mismatch');
 for(const row of rows){
  if(!/^\d+\.\d{2}-\d{2}$/.test(row.id)||ids.has(row.id))throw new Error('Invalid or duplicate identity');
  ids.add(row.id);const bucket=Math.floor(Number(row.id.split('.')[0])/1000);
  if(!buckets.has(bucket))buckets.set(bucket,{});buckets.get(bucket)[row.id]=row;
 }
}
if(ids.size!==manifest.total)throw new Error('National count mismatch');
for(const [bucket,rows] of buckets){
 const bytes=fs.readFileSync(`source-data/context/${bucket}.json`);digest.update(bytes);const context=JSON.parse(bytes);
 for(const [id,row] of Object.entries(rows)){if(!context[id])throw new Error('Missing national context');row.context=context[id];}
}
const hash=digest.digest('hex').slice(0,20);
const directory=`/data/fiches/${hash}`;
fs.mkdirSync(`public${directory}`,{recursive:true});
for(const [bucket,rows] of buckets)fs.writeFileSync(`public${directory}/${bucket}.json`,JSON.stringify(encodeNationalShard(rows)));
fs.writeFileSync('lib/national-manifest.json',JSON.stringify({directory,buckets:[...buckets.keys()],total:ids.size,...manifest.meta}));
console.log(JSON.stringify({projects:ids.size,buckets:buckets.size,directory}));
