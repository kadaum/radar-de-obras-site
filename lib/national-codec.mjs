const fields=['description','goal','socialFunction','beneficiaryDescription'];
// Lossless dictionary for repeated official prose, scoped to a single shard.
export function encodeNationalShard(rows){
 const texts=[],positions=new Map(),encoded=[];
 const first=Object.values(rows)[0];
 const recordKeys=Object.keys(first).filter(key=>key!=='context');
 const contextKeys=Object.keys(first.context);
 for(const [id,row] of Object.entries(rows)){
  if(Object.keys(row).length!==recordKeys.length+1||recordKeys.some(key=>!Object.hasOwn(row,key))||Object.keys(row.context).length!==contextKeys.length||contextKeys.some(key=>!Object.hasOwn(row.context,key)))throw new Error('Inconsistent shard schema');
  const context={...row.context};
  for(const key of fields){
   const value=context[key];if(value==null)continue;
   if(typeof value!=='string')throw new Error(`Invalid source prose: ${id}/${key}`);
   if(!positions.has(value)){positions.set(value,texts.length);texts.push(value);}
   context[key]=positions.get(value);
  }
  encoded.push([recordKeys.map(key=>row[key]),contextKeys.map(key=>context[key])]);
 }
 return {format:'radar-fiches-v3',recordKeys,contextKeys,texts,rows:encoded};
}
export function decodeNationalShard(shard){
 if(shard?.format!=='radar-fiches-v3'||!Array.isArray(shard.texts)||!Array.isArray(shard.rows)||!Array.isArray(shard.recordKeys)||!Array.isArray(shard.contextKeys))throw new Error('Invalid national shard');
 const decoded={};
 for(const [recordValues,contextValues] of shard.rows){
  if(recordValues.length!==shard.recordKeys.length||contextValues.length!==shard.contextKeys.length)throw new Error('Invalid shard row');
  const row=Object.fromEntries(shard.recordKeys.map((key,index)=>[key,recordValues[index]]));
  const context=Object.fromEntries(shard.contextKeys.map((key,index)=>[key,contextValues[index]]));
  const id=row.id;if(typeof id!=='string'||Object.hasOwn(decoded,id))throw new Error('Invalid shard identity');
  for(const key of fields){
   const reference=context[key];if(reference==null)continue;
   if(!Number.isInteger(reference)||reference<0||typeof shard.texts[reference]!=='string')throw new Error(`Invalid prose reference: ${id}/${key}`);
   context[key]=shard.texts[reference];
  }
  decoded[id]={...row,context};
 }
 return decoded;
}
