import { headers } from 'next/headers';
import { env } from 'cloudflare:workers';
import { ORIGIN, type Work } from './organic';
import manifest from './national-manifest.json';
import {decodeNationalShard} from './national-codec.mjs';

export { manifest as nationalManifest };
export type NationalContext = {
 classification: {eixo:string|null;tipo:string|null;subtipo:string|null;id_eixo:number;id_tipo:number;id_subtipo:number}[];
 intervention:string|null;nature:string|null;description:string|null;goal:string|null;socialFunction:string|null;
 beneficiaryDescription:string|null;beneficiaries:number|null;jobs:number|null;
 executors:{organizacao_executor:string}[];takers:{organizacao_tomador:string}[];repayers:{organizacao_repassador:string}[];
};
export type NationalWork=Work & {context:NationalContext};
const recent=new Map<string, Record<string,NationalWork>>();
export async function nationalWork(id:string):Promise<NationalWork|null>{
 if(!/^\d{1,9}\.\d{2}-\d{2}$/.test(id))return null;
 const bucket=Math.floor(Number(id.split('.')[0])/1000);
 if(!manifest.buckets.includes(bucket))return null;
 let origin=ORIGIN;
 // Never use an arbitrary forwarded host as a fetch destination.
 if(process.env.NODE_ENV==='development'){
  const host=(await headers()).get('host');
  if(host&&/^(localhost|127\.0\.0\.1):\d{2,5}$/.test(host))origin=`http://${host}`;
 }
 const url=`${origin}${manifest.directory}/${bucket}.json`;
 let rows=recent.get(url);
 if(!rows){
  const assets=(env as unknown as {ASSETS?:Fetcher}).ASSETS;
  const response=assets ? await assets.fetch(url) : await fetch(url,{signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('National snapshot unavailable');
  rows=decodeNationalShard(await response.json()) as Record<string,NationalWork>;
  if(recent.size>=4)recent.delete(recent.keys().next().value!);
  recent.set(url,rows);
 }
 const work=rows[id];return work?.id===id?work:null;
}
