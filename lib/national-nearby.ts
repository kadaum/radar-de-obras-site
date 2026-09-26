import {env} from 'cloudflare:workers';
import {ORIGIN} from './organic';
import {nationalWork,nationalManifest,type NationalWork} from './national-work';
type Nearby={row:NationalWork;km:number};
const recent=new Map<string,Record<string,[string,number][]>>();
export async function nationalNearby(work:NationalWork):Promise<Nearby[]>{
 if(!work.point)return [];
 const bucket=Math.floor(Number(work.id.split('.')[0])/1000);
 const url=`${ORIGIN}${nationalManifest.directory}/nearby-${bucket}.json`;
 try{
  let rows=recent.get(url);
  if(!rows){const assets=(env as unknown as {ASSETS?:Fetcher}).ASSETS;const response=assets?await assets.fetch(url):await fetch(url,{signal:AbortSignal.timeout(3000)});if(!response.ok)return [];const body=await response.json() as {sourceLoad:string;neighbors:Record<string,[string,number][]>};if(body.sourceLoad!==nationalManifest.sourceLoad)return [];rows=body.neighbors;if(recent.size>=4)recent.delete(recent.keys().next().value!);recent.set(url,rows);}
  const references=(rows[work.id]||[]).filter(([id,km])=>id!==work.id&&typeof km==='number'&&km>=0&&km<=5).slice(0,3);
  const result=await Promise.allSettled(references.map(async([id,km])=>({row:await nationalWork(id),km})));
  return result.flatMap(r=>r.status==='fulfilled'&&r.value.row?[{row:r.value.row,km:r.value.km}]:[]);
 }catch{return [];}
}
