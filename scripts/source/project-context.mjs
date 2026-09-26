import fs from 'node:fs';
import path from 'node:path';

// Whitelisted source fields: no inference and no upload/user data.
export function buildProjectContext(db,dataDir,sourceLoad){
 const buckets=new Map();let total=0;
 for(const {id,raw} of db.prepare('SELECT id,raw FROM projects ORDER BY id').iterate()){
  const p=JSON.parse(raw);const bucket=Math.floor(Number(id.split('.')[0])/1000);
  if(!buckets.has(bucket))buckets.set(bucket,{});
  buckets.get(bucket)[id]={
   classification:Array.isArray(p.eixos_tipos)?p.eixos_tipos:[],
   intervention:p.especie_intervencao??null,nature:p.natureza_intervencao??null,
   description:p.desc_projeto??null,goal:p.desc_meta_global??null,
   socialFunction:p.desc_funcao_social??null,
   beneficiaries:p.populacao_beneficiada??null,beneficiaryDescription:p.desc_populacao_beneficiada??null,
   jobs:p.qtd_empregos_gerados??null,
   executors:p.executores??[],takers:p.tomadores??[],repayers:p.repassadores??[],
  };total++;
 }
 const dir=path.join(dataDir,'context');fs.mkdirSync(dir,{recursive:true});
 for(const [bucket,rows] of buckets)fs.writeFileSync(path.join(dir,`${bucket}.json`),JSON.stringify(rows));
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({sourceLoad,total,buckets:[...buckets.keys()]}));
 return {total,buckets:buckets.size};
}
