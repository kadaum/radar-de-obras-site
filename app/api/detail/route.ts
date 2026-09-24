/* oxlint-disable typescript/no-explicit-any -- Obrasgov responses vary by endpoint and have no generated client types. */
import { data, getWork, sourceLink } from '@/lib/organic';
const API = 'https://api-publica.obrasgov.gestao.gov.br/obras';
const endpoints = ['projeto-investimento','geometria','execucao-fisica','empenho','contrato','historico-situacao-cancelada-paralisada'];
const rows = (payload: any) => Array.isArray(payload?.data) ? payload.data : [];

function selectedFallback(id: string) {
  const found = getWork(id);
  if (!found) return null;
  const {work,detail}=found;
  return {id,name:work.name,description:detail.description,uf:work.uf,status:work.status,
    address:work.address,city:work.city,start:work.start,end:work.end,actualStart:detail.actualStart,
    actualEnd:detail.actualEnd,organization:work.organization,point:work.point,
    locationMethod:'Coordenada preservada do último snapshot validado; localização precisa requer conferência',
    investments:detail.rawInvestment.map(item=>({vl_investimento_previsto:item.plannedBRL,desc_nome_fonte_recurso:item.source})),
    executors:[],execution:null,commitments:[],contracts:[],history:[],detailsChecked:false,
    fallbackEndpoints:['projeto-investimento','geometria','execucao-fisica','empenho','contrato','historico-situacao-cancelada-paralisada'],
    seedFallbackCollectedAt:detail.checkedAt,collectedAt:data.source.collectedAt,sourceUrl:sourceLink(id)};
}

function point(raw: any) {
  for (const pin of raw?.pins ?? []) {
    const direct=[Number(pin.longitude),Number(pin.latitude)];
    if(direct.every(Number.isFinite)&&direct[0]>=-74&&direct[0]<=-28&&direct[1]>=-34&&direct[1]<=6)return direct;
    const match=String(pin.pin??'').match(/POINT\s*\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)/i);
    if(match)return [Number(match[1]),Number(match[2])];
  }
  return null;
}

export async function GET(request: Request) {
  const id=new URL(request.url).searchParams.get('id')?.slice(0,80);
  if(!id)return Response.json({error:'ID não informado'},{status:400});
  const results=await Promise.allSettled(endpoints.map(async endpoint=>{
    const response=await fetch(`${API}/${endpoint}?id_projeto_investimento=${encodeURIComponent(id)}&pagina=1&tamanho_da_pagina=200`,{headers:{accept:'application/json'}});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    return response.json() as Promise<any>;
  }));
  if(results[0].status==='rejected'){
    const fallback=selectedFallback(id);
    return fallback?Response.json(fallback,{headers:{'Cache-Control':'no-store'}}):Response.json({error:'A fonte não respondeu à consulta do projeto.'},{status:502});
  }
  const values:any=Object.fromEntries(results.map((result,index)=>[endpoints[index],result.status==='fulfilled'?rows(result.value):[]]));
  const raw=values['projeto-investimento'][0];
  if(!raw)return Response.json({error:'Projeto não encontrado na fonte.'},{status:404});
  const executions=[...values['execucao-fisica']].sort((a:any,b:any)=>String(b.dt_atualizacao_execucao??'').localeCompare(String(a.dt_atualizacao_execucao??'')));
  const collectedAt=new Date().toISOString();
  return Response.json({id:raw.id_projeto_investimento,name:raw.desc_nome||'Projeto sem título informado',description:raw.desc_projeto,uf:raw.uf_principal,status:raw.situacao||'Não informada',address:raw.desc_endereco,cep:raw.nr_cep,city:[...new Set(values.geometria.map((g:any)=>g.no_municipio).filter(Boolean))].join(' / ')||null,start:raw.dt_inicial_prevista,end:raw.dt_final_prevista,actualStart:raw.dt_inicial_efetiva,actualEnd:raw.dt_final_efetiva,organization:raw.organizacao_resp,organizationCnpj:raw.cnpj_organizacao_resp,kind:raw.especie_intervencao,sourceSystem:raw.sistema_resp,point:point(raw),locationMethod:'Coordenada informada pela fonte; localização precisa requer conferência',investments:Array.isArray(raw.investimentos_previstos)?raw.investimentos_previstos:[],executors:Array.isArray(raw.executores)?raw.executores:[],execution:executions[0]??null,commitments:values.empenho,contracts:values.contrato,history:values['historico-situacao-cancelada-paralisada'],detailsChecked:true,detailErrors:results.flatMap((r,i)=>r.status==='rejected'?[endpoints[i]]:[]),collectedAt,sourceUrl:`${API}/projeto-investimento?id_projeto_investimento=${encodeURIComponent(id)}`});
}
