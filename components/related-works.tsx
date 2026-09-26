import Link from 'next/link';
import {MapPin,ArrowUpRight} from 'lucide-react';
import {areaPath} from '@/lib/official-areas.mjs';
import {workPath,type Work} from '@/lib/organic';

export function RelatedWorks({nearby,area,localHref}:{nearby:{row:Work;km:number}[];area?:string|null;localHref?:string}){
 const rows=nearby.slice(0,3);
 return <section className="related-works" id="veja-tambem"><div className="related-heading"><div><span className="eyebrow">Continue explorando</span><h2>Veja também</h2><p>{rows.length?'Outros projetos com pontos cadastrados até 5 km desta referência.':'Explore outras obras pela classificação oficial ou na lista nacional.'}</p></div><MapPin size={24} aria-hidden="true"/></div>
  {rows.length>0&&<div className="related-grid">{rows.map(({row,km})=><Link key={row.id} href={workPath(row.id)} className="related-work-card"><span>{row.city||row.uf||'Localização não informada'} · {km<.1?'Menos de 100 m':`${km.toLocaleString('pt-BR',{maximumFractionDigits:1})} km`}</span><strong>{row.name}</strong><small>{row.status||'Situação não informada'}</small><ArrowUpRight size={17} aria-hidden="true"/></Link>)}</div>}
  <div className="related-actions">{localHref&&<Link href={localHref}>Mais obras desta cidade <ArrowUpRight size={16} aria-hidden="true"/></Link>}{area&&<Link href={areaPath(area)}>Explorar obras de {area} <ArrowUpRight size={16} aria-hidden="true"/></Link>}<Link href="/areas">Todas as áreas <ArrowUpRight size={16} aria-hidden="true"/></Link><Link href="/obras">Todas as fichas <ArrowUpRight size={16} aria-hidden="true"/></Link></div>
  {rows.length>0&&<p className="context-note">Distâncias em linha reta entre pontos do cadastro, que podem ser aproximados ou administrativos. Proximidade não significa relação contratual entre os projetos.</p>}
 </section>;
}
