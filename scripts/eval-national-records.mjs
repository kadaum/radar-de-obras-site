import fs from 'node:fs';
import assert from 'node:assert/strict';
import {officialRecords} from '../lib/official-records.mjs';
import {decodeNationalShard} from '../lib/national-codec.mjs';
import manifest from '../lib/national-manifest.json' with {type:'json'};
import pilots from '../lib/organic-details.json' with {type:'json'};
const base=process.argv[2]||'http://localhost:3005';
const selected=[];
for(let i=0;i<manifest.buckets.length;i+=17){const rows=decodeNationalShard(JSON.parse(fs.readFileSync(`public${manifest.directory}/${manifest.buckets[i]}.json`)));const row=Object.values(rows).find(r=>!pilots[r.id]);if(row)selected.push(row.id);}
const clean=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/\s+/g,' ').trim();
const money=v=>typeof v==='number'&&Number.isFinite(v)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v):'Não informado';
selected.push('2987.32-09','53408.35-50');
const results=[];
for(const id of selected){
 const start=performance.now();const response=await fetch(`${base}/obras/${id}`);const html=await response.text();const firstRequestMs=Math.round(performance.now()-start);assert.equal(response.status,200);
 const warmStart=performance.now();const warm=await fetch(`${base}/obras/${id}`);await warm.arrayBuffer();const warmMs=Math.round(performance.now()-warmStart);
 const section=html.match(/<section class="enrichment-section" id="contratos-andamento">([\s\S]*?)<\/section>/)?.[1];assert.ok(section,id);
 const fields=[...section.matchAll(/<dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd>/g)].map(m=>[clean(m[1]),clean(m[2])]);
 const [contracts,executions,commitments,studies]=await Promise.all(['contrato','execucao-fisica','empenho','estudo-viabilidade'].map(route=>officialRecords(route,id)));
 let comparisons=0;
 for(const [result,mapping] of [[contracts,{'Empresa contratada':r=>r.fornecedor_contrato||'Não informada','CNPJ da empresa':r=>r.cnpj_fornecedor_contrato||'Não informado','Valor global do contrato':r=>money(r.valor_global_contrato)}],[commitments,{'Credor':r=>r.credor||'Não informado','Valor do empenho':r=>money(r.valor_empenho),'Pago informado':r=>money(r.pago),'Restos a pagar pagos':r=>money(r.rppago)}]]){
  if(!result.complete)continue;
  for(const [label,getValue] of Object.entries(mapping)){const actual=fields.filter(([key])=>key===label).map(([,v])=>v);const expected=result.rows.map(r=>clean(String(getValue(r))));assert.deepEqual(actual,expected,`${id}: ${label}`);comparisons+=expected.length;}
 }
 for(const s of studies.rows){for(const field of ['tipo_estudo_viabilidade','especificacao_estudo_viabilidade'])if(s[field]){assert.ok(clean(section).includes(clean(s[field])),id);comparisons++;}}
 assert.ok(section.includes(`${studies.rows.length}<!-- --> registro(s) de estudo de viabilidade`)||studies.rows.length===0||clean(section).includes(`${studies.rows.length} registro(s) de estudo de viabilidade`),id);
 const percent=executions.complete&&executions.rows.length===1?executions.rows[0].percentual_execucao_fisica:null;
 const valid=typeof percent==='number'&&Number.isFinite(percent)&&percent>=0&&percent<=100;
 assert.equal(section.includes('aria-label="Percentual de execução física informado"'),valid,`${id}: progress eligibility`);
 results.push({id,firstRequestMs,warmMs,comparisons,contracts:contracts.rows.length,executions:executions.rows.length,commitments:commitments.rows.length,studies:studies.rows.length,allComplete:[contracts,executions,commitments,studies].every(r=>r.complete)});
}
const report={checkedAt:new Date().toISOString(),base,sampling:'First nonpilot record every 17th shard; systematic exploratory sample plus two targeted contract/study cases, not national prevalence estimate',results};
fs.writeFileSync('.sites-runtime/national-records-eval.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
