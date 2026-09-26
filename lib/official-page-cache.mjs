import {officialRecords} from './official-records.mjs';

// Only public official records enter this cache. Never cache requests or user headers.
export function createOfficialPageCache({load=officialRecords,cache=()=>globalThis.caches?.default,now=Date.now,origin='https://radar-obras.ricardoguia.com'}={}){
 const recent=new Map();const pending=new Map();
 const valid=(value,id)=>value?.id===id&&Number.isFinite(value.expires)&&value.expires>now()&&typeof value.checkedAt==='string'&&['contracts','executions'].every(key=>Array.isArray(value[key]?.rows)&&typeof value[key].complete==='boolean'&&value[key].rows.every(row=>row.id_projeto_investimento===id));
 const remember=(id,value)=>{if(recent.size>=64)recent.delete(recent.keys().next().value);recent.set(id,value);return value;};
 async function read(id){
  const key=new Request(`${origin}/__official-cache/v1/${encodeURIComponent(id)}`);
  let edge;
  try{edge=cache();const response=await edge?.match(key);if(response){const saved=await response.json();if(valid(saved,id))return remember(id,saved);}}catch{/* Cache failures must not remove public facts. */}
  const [contracts,executions]=await Promise.all(['contrato','execucao-fisica'].map(endpoint=>load(endpoint,id)));
  const ttl=contracts.complete&&executions.complete?21600:60;
  const timestamp=now();const value={id,contracts,executions,checkedAt:new Date(timestamp).toISOString(),expires:timestamp+ttl*1000};
  remember(id,value);
  try{await edge?.put(key,Response.json(value,{headers:{'Cache-Control':`public, max-age=${ttl}`}}));}catch{/* Caching is an optimization, not a persistence guarantee. */}
  return value;
 }
 return async function records(id){
  if(!/^\d{1,9}\.\d{2}-\d{2}$/.test(id))throw new Error('Invalid project ID');
  const saved=recent.get(id);if(valid(saved,id))return saved;
  if(pending.has(id))return pending.get(id);
  const task=read(id);pending.set(id,task);
  try{return await task;}finally{pending.delete(id);}
 };
}
export const officialPageRecords=createOfficialPageCache();
