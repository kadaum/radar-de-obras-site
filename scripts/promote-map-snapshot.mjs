import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(process.cwd());
const runtime=path.join(root,'.sites-runtime');
const publicData=path.join(root,'public','data');
const input=process.argv[2];
if(!input)throw new Error('Usage: node scripts/promote-map-snapshot.mjs <validated-candidate-directory>');
const candidate=path.resolve(input);
if(!candidate.startsWith(runtime+path.sep)||!path.basename(candidate).startsWith('organic-candidate-'))throw new Error('Candidate must be inside this checkout runtime');
if(!publicData.startsWith(root+path.sep)||!runtime.startsWith(root+path.sep))throw new Error('Unexpected workspace path');
const report=JSON.parse(fs.readFileSync(path.join(candidate,'validation.json'),'utf8'));
const nextData=path.join(candidate,'data');
if(report.status!=='validated'||path.resolve(report.dataDir)!==nextData||!fs.statSync(nextData).isDirectory())throw new Error('Candidate validation missing or mismatched');
const manifest=JSON.parse(fs.readFileSync(path.join(nextData,'projects-manifest.json'),'utf8'));
if(manifest.total!==report.count||manifest.meta.sourceLoad!==report.loadAfter||manifest.files.reduce((sum,file)=>sum+file.rows,0)!==manifest.total)throw new Error('Candidate manifest mismatch');
const previous=JSON.parse(fs.readFileSync(path.join(root,'lib','organic-data.json'),'utf8'));
const seen=new Set();
const found=new Map();
for(const file of manifest.files){const filePath=path.join(nextData,file.url.replace('/data/',''));const chunk=JSON.parse(fs.readFileSync(filePath,'utf8'));
  if(chunk.length!==file.rows)throw new Error(`Chunk mismatch ${file.url}`);
  for(const row of chunk){if(!row.id||seen.has(row.id))throw new Error(`Duplicate ID ${row.id}`);seen.add(row.id);if(previous.cities.some(city=>city.ids.includes(row.id)))found.set(row.id,row);}
}
if(seen.size!==manifest.total)throw new Error('Unique ID total mismatch');
for(const city of previous.cities)for(const id of city.ids){const row=found.get(id);if(!row||row.city!==city.name||row.uf!==city.uf)throw new Error(`Pilot project moved or missing: ${id}`);}
const backup=path.join(runtime,`data-backup-${new Date().toISOString().replace(/[:.]/g,'-')}`);
if(fs.existsSync(backup))throw new Error('Backup collision');
fs.renameSync(publicData,backup);
try{fs.renameSync(nextData,publicData);}catch(error){fs.renameSync(backup,publicData);throw error;}
console.log(JSON.stringify({status:'promoted',candidate,backup,sourceLoad:report.loadAfter,total:manifest.total,selected:found.size}));
