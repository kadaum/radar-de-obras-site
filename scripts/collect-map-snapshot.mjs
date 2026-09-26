// Collects a complete candidate map snapshot without touching public/data.
// Run `node scripts/collect-map-snapshot.mjs`; promote only after reviewing its
// validation report and running build-organic-snapshot against the candidate.
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { geographyCheck } from './source/geography.js';
import { buildProjectContext } from './source/project-context.mjs';

const API='https://api-publica.obrasgov.gestao.gov.br/obras';
const root=process.cwd();
const runtime=path.join(root,'.sites-runtime');
fs.mkdirSync(runtime,{recursive:true});
const candidate=fs.mkdtempSync(path.join(runtime,'organic-candidate-'));
const dataDir=path.join(candidate,'data');
const chunksDir=path.join(dataDir,'chunks');
fs.mkdirSync(chunksDir,{recursive:true});
const db=new DatabaseSync(path.join(candidate,'source.sqlite'));
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE projects(id TEXT PRIMARY KEY, raw TEXT NOT NULL); CREATE TABLE geometries(project_id TEXT NOT NULL, municipality TEXT, uf TEXT); CREATE INDEX geometry_project_idx ON geometries(project_id);');
const insertProject=db.prepare('INSERT INTO projects(id,raw) VALUES(?,?)');
const insertGeo=db.prepare('INSERT INTO geometries(project_id,municipality,uf) VALUES(?,?,?)');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let nextRequest=0;
async function request(url){
  let last;
  for(let attempt=0;attempt<5;attempt++){
    const wait=Math.max(0,nextRequest-Date.now());nextRequest=Math.max(nextRequest,Date.now())+180;
    if(wait)await sleep(wait);
    try{const response=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout(60000)});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const body=await response.json();return body;
    }catch(error){last=error;if(attempt<4)await sleep(Math.min(15000,700*2**attempt));}
  }
  throw last;
}
async function sourceLoad(){const body=await request(`${API}/data-atualizacao`);if(!body.data_ultima_atualizacao)throw new Error('Missing source load');return body.data_ultima_atualizacao;}
const loadBefore=await sourceLoad();
const totals={};
async function collect(endpoint){
  const first=await request(`${API}/${endpoint}?pagina=1&tamanho_da_pagina=200`);
  const pages=Number(first.total_pages),total=Number(first.total_items);
  if(!Number.isInteger(pages)||pages<1||!Number.isInteger(total)||total<1||!Array.isArray(first.data))throw new Error(`Invalid pagination ${endpoint}`);
  let received=0;
  const accept=(body,page)=>{
    if(!Array.isArray(body.data)||body.data.length<1||body.data.length>200||Number(body.total_items)!==total||Number(body.total_pages)!==pages)throw new Error(`Page shape changed ${endpoint} ${page}`);
    db.exec('BEGIN');
    try{for(const raw of body.data){const id=raw.id_projeto_investimento==null?'':String(raw.id_projeto_investimento);
      if(!id)throw new Error(`Missing ID ${endpoint} ${page}`);
      if(endpoint==='projeto-investimento')insertProject.run(id,JSON.stringify(raw));
      else insertGeo.run(id,raw.no_municipio??null,raw.sg_uf??null);
    }db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
    received+=body.data.length;
  };
  accept(first,1);
  let cursor=2;
  const workers=Array.from({length:2},async()=>{while(cursor<=pages){const page=cursor++;const body=await request(`${API}/${endpoint}?pagina=${page}&tamanho_da_pagina=200`);accept(body,page);if(page%100===0)console.log(JSON.stringify({endpoint,page,pages,received}));}});
  await Promise.all(workers);
  if(received!==total)throw new Error(`Total mismatch ${endpoint}: ${received}/${total}`);
  totals[endpoint]=received;
}
try{
  await collect('projeto-investimento');
  await collect('geometria');
  const loadAfter=await sourceLoad();
  if(loadAfter!==loadBefore)throw new Error(`Source load changed during collection: ${loadBefore} -> ${loadAfter}`);
  const orphan=db.prepare('SELECT COUNT(*) AS count FROM geometries g WHERE NOT EXISTS(SELECT 1 FROM projects p WHERE p.id=g.project_id)').get().count;
  if(orphan)throw new Error(`${String(orphan)} orphan geometries`);
  const integrity=db.prepare('PRAGMA integrity_check').get().integrity_check;
  if(integrity!=='ok')throw new Error(`SQLite integrity: ${String(integrity)}`);
  const validPoint=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=-74&&p[0]<=-28&&p[1]>=-34&&p[1]<=6;
  function point(pins){for(const pin of pins??[]){const direct=[Number(pin.longitude),Number(pin.latitude)];
    const match=String(pin.pin??'').match(/POINT\s*\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)/i);
    const wkt=match?[Number(match[1]),Number(match[2])]:null;
    if(validPoint(direct)&&validPoint(wkt)&&Math.hypot(direct[0]-wkt[0],direct[1]-wkt[1])>0.0001)continue;
    const candidate=validPoint(direct)?direct:validPoint(wkt)?wkt:null;
    if(candidate&&geographyCheck(candidate)!=='outside')return candidate;
  }return null;}
  const geometries=db.prepare('SELECT municipality FROM geometries WHERE project_id=? ORDER BY municipality');
  const files=[];let batch=[],count=0,withValue=0,withPoint=0;
  function flush(){if(!batch.length)return;const name=`projects-${String(files.length+1).padStart(2,'0')}.json`;
    fs.writeFileSync(path.join(chunksDir,name),JSON.stringify(batch));files.push({url:`/data/chunks/${name}`,rows:batch.length});batch=[];}
  for(const record of db.prepare('SELECT id,raw FROM projects ORDER BY rowid').iterate()){
    const raw=JSON.parse(record.raw);
    const localities=[...new Set(geometries.all(record.id).map(item=>item.municipality).filter(Boolean))];
    const amounts=(raw.investimentos_previstos??[]).map(item=>item.vl_investimento_previsto).filter(value=>value!==null&&value!==undefined&&value!=='').map(Number).filter(Number.isFinite);
    const investmentTotal=amounts.length?amounts.reduce((sum,value)=>sum+value,0):null;
    const coord=point(raw.pins);
    if(investmentTotal!==null)withValue++;if(coord)withPoint++;
    batch.push({id:record.id,name:raw.desc_nome||'Projeto sem título informado',uf:raw.uf_principal||null,status:raw.situacao||'Não informada',address:raw.desc_endereco||null,cep:raw.nr_cep||null,city:localities.join(' / ')||null,start:raw.dt_inicial_prevista||null,end:raw.dt_final_prevista||null,organization:raw.organizacao_resp||null,point:coord,investmentTotal});
    count++;if(batch.length===4000)flush();
  }
  flush();
  if(count!==totals['projeto-investimento'])throw new Error('Export total mismatch');
  const collectedAt=new Date().toISOString();
  const manifest={meta:{collectedAt,sourceLoad:loadAfter,sourceTotal:count,scope:`Coleta validada dos endpoints projeto-investimento e geometria do Obrasgov: ${count.toLocaleString('pt-BR')} cadastros. Não representa todas as obras existentes no Brasil.`,full:true,endpointTotals:totals,investmentCollectedAt:collectedAt,investmentSourceLoad:loadAfter,investmentCoverage:{projects:count,withValue,withoutValue:count-withValue,missingFromSource:0}},files,total:count};
    fs.writeFileSync(path.join(dataDir,'projects-manifest.json'),JSON.stringify(manifest));
    const context=buildProjectContext(db,dataDir,loadAfter);
    if(context.total!==count)throw new Error('Context total mismatch');
  const report={status:'validated',candidate,dataDir,loadBefore,loadAfter,totals,count,withValue,withPoint,orphan,integrity,files:files.length,collectedAt};
  fs.writeFileSync(path.join(candidate,'validation.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({event:'candidate-ready',...report}));
}catch(error){fs.writeFileSync(path.join(candidate,'failure.json'),JSON.stringify({message:String(error),at:new Date().toISOString()},null,2));console.error(`Candidate preserved at ${candidate}: ${error.message}`);process.exitCode=1;}finally{db.close();}
