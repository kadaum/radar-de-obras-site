import test from 'node:test';
import assert from 'node:assert/strict';
import {createOfficialPageCache} from '../lib/official-page-cache.mjs';
const id='4902.35-23';
const result=(complete=true)=>({rows:[{id_projeto_investimento:id}],complete,failed:!complete,total:1});
function fixture(){
 let time=Date.parse('2026-09-25T12:00:00Z'),calls=0,complete=true;
 const entries=new Map();
 const edge={match:async key=>entries.get(key.url)?.clone(),put:async(key,response)=>entries.set(key.url,response.clone())};
 const options={cache:()=>edge,now:()=>time,load:async()=>{calls++;return result(complete);}};
 return {options,entries,calls:()=>calls,advance:ms=>time+=ms,partial:()=>complete=false};
}
void test('simultaneous readers share upstream calls and a new instance reuses public cache',async()=>{
 const f=fixture(),read=createOfficialPageCache(f.options);
 const answers=await Promise.all(Array.from({length:12},()=>read(id)));
 assert.equal(f.calls(),4);assert.ok(answers.every(x=>x.checkedAt===answers[0].checkedAt));
 const separate=createOfficialPageCache(f.options);assert.deepEqual(await separate(id),answers[0]);assert.equal(f.calls(),4);
 const response=[...f.entries.values()][0];assert.equal(response.headers.get('cache-control'),'public, max-age=21600');
 f.advance(21600001);const refreshed=await separate(id);assert.equal(f.calls(),8);assert.notEqual(refreshed.checkedAt,answers[0].checkedAt);
});
void test('upstream failure is labeled and retried after one minute, not six hours',async()=>{
 const f=fixture();f.partial();const read=createOfficialPageCache(f.options);
 const first=await read(id);assert.equal(first.contracts.complete,false);
 assert.equal([...f.entries.values()][0].headers.get('cache-control'),'public, max-age=60');
 f.advance(59000);await read(id);assert.equal(f.calls(),4);
 f.advance(1001);await read(id);assert.equal(f.calls(),8);
});
void test('broken or mismatched cache cannot erase data or mix projects',async()=>{
 const f=fixture();await createOfficialPageCache(f.options)(id);
 const key=[...f.entries.keys()][0];f.entries.set(key,Response.json({id:'another',expires:Infinity}));
 await createOfficialPageCache(f.options)(id);assert.equal(f.calls(),8);
 const badCache={match:async()=>{throw new Error('offline');},put:async()=>{throw new Error('offline');}};
 const read=createOfficialPageCache({...f.options,cache:()=>badCache});assert.equal((await read(id)).contracts.complete,true);
 await assert.rejects(()=>read('../private'));
});
