import {env} from 'cloudflare:workers';
import {ORIGIN} from './organic';
import manifest from './official-areas.json';

export type AreaRow=[id:string,name:string,city:string|null,uf:string|null,status:string|null,investment:number|null];
export type AreaEntry=(typeof manifest.entries)[number];
export const areas=manifest.entries;
const recent=new Map<string,AreaRow[]>();
export async function areaRows(entry:AreaEntry):Promise<AreaRow[]>{
 const cached=recent.get(entry.slug);if(cached)return cached;
 const url=`${ORIGIN}${entry.file}`;
 const assets=(env as unknown as {ASSETS?:Fetcher}).ASSETS;
 const response=assets?await assets.fetch(url):await fetch(url,{signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error('Area index unavailable');
 const body=await response.json() as {sourceLoad:string;rows:AreaRow[]};
 if(body.sourceLoad!==manifest.sourceLoad||body.rows.length!==entry.count)throw new Error('Area index mismatch');
 if(recent.size>=3)recent.delete(recent.keys().next().value!);
 recent.set(entry.slug,body.rows);
 return body.rows;
}
