import type {Metadata} from 'next';
import {ORIGIN} from './organic';
export function pageMetadata(path:string,title:string,description:string,robots?:Metadata['robots']):Metadata {
  const url=`${ORIGIN}${path}`;
  return {title,description,alternates:{canonical:path},robots,
    openGraph:{type:'website',locale:'pt_BR',url,siteName:'Radar de Obras',title,description,images:[{url:`${ORIGIN}/og-radar.png`,width:1200,height:630,alt:'Radar de Obras — infraestrutura pública no mapa do Brasil'}]},
    twitter:{card:'summary_large_image',title,description,images:[`${ORIGIN}/og-radar.png`]}};
}
