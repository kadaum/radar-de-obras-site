import { detailResponse } from '@/lib/official-records.mjs';
import { nationalWork, nationalManifest } from '@/lib/national-work';
import { getWork, sourceLink } from '@/lib/organic';

export async function GET(request:Request){
 const id=new URL(request.url).searchParams.get('id');
 if(!id)return Response.json({error:'ID não informado'},{status:400});
 return detailResponse(id,{fallback:async(savedId:string)=>{
  const work=await nationalWork(savedId);if(!work)return null;
  const pilot=getWork(savedId);
  return {...work,description:work.context.description,classification:work.context.classification,
   kind:work.context.intervention,executors:work.context.executors,
   actualStart:pilot?.detail.actualStart??null,actualEnd:pilot?.detail.actualEnd??null,
   investments:pilot?pilot.detail.rawInvestment.map(x=>({vl_investimento_previsto:x.plannedBRL,desc_nome_fonte_recurso:x.source})):
    work.investmentTotal==null?[]:[{vl_investimento_previsto:work.investmentTotal,desc_nome_fonte_recurso:'Total previsto preservado do cadastro'}],
   execution:null,executions:[],commitments:[],contracts:[],history:[],
   locationMethod:'Ponto preservado do cadastro; pode ser aproximado ou administrativo',
   seedFallbackCollectedAt:nationalManifest.collectedAt,collectedAt:nationalManifest.collectedAt,sourceUrl:sourceLink(savedId)};
 }});
}
