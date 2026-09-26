import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {detailResponse,officialRecords,officialPoint} from '../lib/official-records.mjs';
import manifest from '../lib/national-manifest.json' with {type:'json'};
const id='44379.35-79';
const row=JSON.parse(fs.readFileSync(`public${manifest.directory}/44.json`))[id];
const envelope=(rows,pages=1,total=rows.length,page=1)=>Response.json({data:rows,total_pages:pages,total_items:total,page_number:page});
void test('non-pilot project preserves snapshot and true date during outage',async()=>{
 const response=await detailResponse(id,{fetcher:async()=>{throw Error('offline');},fallback:async key=>key===id?{...row,collectedAt:manifest.collectedAt}:null});
 assert.equal(response.status,200);const result=await response.json();assert.equal(result.name,row.name);assert.equal(result.collectedAt,manifest.collectedAt);assert.equal(result.detailsChecked,false);assert.ok(result.fallbackEndpoints.includes('contrato'));
});
void test('paginated official rows keep all pages and project identity',async()=>{
 const result=await officialRecords('contrato',id,{fetcher:async url=>{const page=Number(new URL(url).searchParams.get('pagina'));return envelope([{id_projeto_investimento:id,id_contrato:page}],2,2,page);}});
 assert.equal(result.complete,true);assert.deepEqual(result.rows.map(x=>x.id_contrato),[1,2]);
 const wrong=await officialRecords('contrato',id,{fetcher:async()=>envelope([{id_projeto_investimento:'other'}])});assert.equal(wrong.failed,true);assert.equal(wrong.rows.length,0);
});
void test('bounded and failed subsequent pages are explicitly incomplete',async()=>{
 const fetcher=async url=>{const page=Number(new URL(url).searchParams.get('pagina'));if(page===2)throw Error('offline');return envelope([{id_projeto_investimento:id}],2,2,page);};
 const failed=await officialRecords('contrato',id,{fetcher});assert.equal(failed.failed,true);assert.equal(failed.complete,false);assert.equal(failed.rows.length,1);
 const bounded=await officialRecords('contrato',id,{fetcher,maxPages:1});assert.equal(bounded.failed,false);assert.equal(bounded.complete,false);
});
void test('missing valid ID and source outage differ; malformed IDs are rejected',async()=>{
 const missing=await detailResponse(id,{fetcher:async()=>envelope([])});assert.equal(missing.status,404);
 const outage=await detailResponse(id,{fetcher:async()=>{throw Error('offline');}});assert.equal(outage.status,502);
 const malformed=await detailResponse('invalid');assert.equal(malformed.status,400);
});
void test('point parser rejects null coercion and invalid geography',()=>{
 assert.equal(officialPoint({pins:[{longitude:null,latitude:null}]}),null);
 assert.equal(officialPoint({pins:[{pin:'POINT (999 999)'}]}),null);
 assert.deepEqual(officialPoint({pins:[{pin:'POINT (-46.7 -23.4)'}]}),[-46.7,-23.4]);
});

