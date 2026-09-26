export const OFFICIAL_API='https://api-publica.obrasgov.gestao.gov.br/obras';
export const DETAIL_ENDPOINTS=['projeto-investimento','geometria','execucao-fisica','empenho','contrato','historico-situacao-cancelada-paralisada'];

export async function officialRecords(endpoint,id,{fetcher=fetch,maxPages=8,timeoutMs=8000}={}){
 const result=[];let total=null;let pages=null;const deadline=Date.now()+timeoutMs;
 try{
  for(let page=1;page<=maxPages;page++){
   const remaining=deadline-Date.now();if(remaining<=0)throw new Error('Timeout');
   const response=await fetcher(`${OFFICIAL_API}/${endpoint}?id_projeto_investimento=${encodeURIComponent(id)}&pagina=${page}&tamanho_da_pagina=200`,{headers:{accept:'application/json'},signal:AbortSignal.timeout(remaining)});
   if(!response.ok)throw new Error(`HTTP ${response.status}`);
   const body=await response.json();
   if(!Array.isArray(body.data)||!Number.isInteger(body.total_items)||body.total_items<0||!Number.isInteger(body.total_pages)||body.total_pages<0)throw new Error('Invalid envelope');
   if(body.data.some(row=>!row||row.id_projeto_investimento!==id))throw new Error('Project mismatch');
   if(body.page_number!==undefined&&body.page_number!==page)throw new Error('Page mismatch');
   if(total!==null&&(total!==body.total_items||pages!==body.total_pages))throw new Error('Pagination changed');
   total=body.total_items;pages=body.total_pages;
   if(result.length+body.data.length>total)throw new Error('Count exceeds total');
   result.push(...body.data);
   if(page>=pages){if(result.length!==total)throw new Error('Incomplete count');return {rows:result,complete:true,failed:false,total};}
   if(body.data.length===0)throw new Error('Empty intermediate page');
  }
  return {rows:result,complete:false,failed:false,total};
 }catch{return {rows:result,complete:false,failed:true,total};}
}

/** @param {string} id @param {{fetcher?: typeof fetch, fallback?: (id:string)=>Promise<object|null>}} options */
export async function detailResponse(id,{fetcher=fetch,fallback=async()=>null}={}){
 if(!/^\d{1,9}\.\d{2}-\d{2}$/.test(id))return Response.json({error:'ID inválido'},{status:400});
 const results=await Promise.all(DETAIL_ENDPOINTS.map(endpoint=>officialRecords(endpoint,id,{fetcher})));
 const project=results[0];
 if(!project.complete||project.rows.length!==1){
  const saved=await fallback(id);
  if(saved)return Response.json({...saved,detailsChecked:false,fallbackEndpoints:DETAIL_ENDPOINTS},{headers:{'Cache-Control':'no-store'}});
  const absent=project.complete&&project.rows.length===0;
  return Response.json({error:absent?'Projeto não encontrado na fonte.':'A fonte não respondeu corretamente à consulta do projeto.'},{status:absent?404:502,headers:{'Cache-Control':'no-store'}});
 }
 const raw=project.rows[0];const values=Object.fromEntries(DETAIL_ENDPOINTS.map((key,i)=>[key,results[i].rows]));
 const executions=[...values['execucao-fisica']].sort((a,b)=>String(b.dt_atualizacao_execucao??'').localeCompare(String(a.dt_atualizacao_execucao??'')));
 return Response.json({id:raw.id_projeto_investimento,name:raw.desc_nome||'Projeto sem título informado',description:raw.desc_projeto,uf:raw.uf_principal,status:raw.situacao||'Não informada',address:raw.desc_endereco,cep:raw.nr_cep,city:[...new Set(values.geometria.map(g=>g.no_municipio).filter(Boolean))].join(' / ')||null,start:raw.dt_inicial_prevista,end:raw.dt_final_prevista,actualStart:raw.dt_inicial_efetiva,actualEnd:raw.dt_final_efetiva,organization:raw.organizacao_resp,organizationCnpj:raw.cnpj_organizacao_resp,kind:raw.especie_intervencao,sourceSystem:raw.sistema_resp,point:officialPoint(raw),locationMethod:'Coordenada informada pela fonte; localização precisa requer conferência',investments:Array.isArray(raw.investimentos_previstos)?raw.investimentos_previstos:[],executors:Array.isArray(raw.executores)?raw.executores:[],classification:Array.isArray(raw.eixos_tipos)?raw.eixos_tipos:[],executions,execution:executions.length===1?executions[0]:null,commitments:values.empenho,contracts:values.contrato,history:values['historico-situacao-cancelada-paralisada'],detailsChecked:true,detailErrors:results.flatMap((r,i)=>r.failed?[DETAIL_ENDPOINTS[i]]:[]),truncatedEndpoints:results.flatMap((r,i)=>!r.complete&&r.rows.length?[DETAIL_ENDPOINTS[i]]:[]),collectedAt:new Date().toISOString(),sourceUrl:`${OFFICIAL_API}/projeto-investimento?id_projeto_investimento=${encodeURIComponent(id)}`},{headers:{'Cache-Control':'no-store'}});
}
export function officialPoint(raw){
 for(const pin of raw?.pins??[]){
  let pair=pin.longitude!=null&&pin.latitude!=null?[Number(pin.longitude),Number(pin.latitude)]:null;
  if(!pair){const match=String(pin.pin??'').match(/^POINT\s*\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)$/i);if(match)pair=[Number(match[1]),Number(match[2])];}
  if(pair?.every(Number.isFinite)&&pair[0]>=-74&&pair[0]<=-28&&pair[1]>=-34&&pair[1]<=6)return pair;
 }return null;
}
