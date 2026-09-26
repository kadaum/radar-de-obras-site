import Link from 'next/link';
import {DiscoveryShell,PageSchema,Structured} from '@/components/discovery';
import {areas} from '@/lib/official-areas-data';
import {ORIGIN} from '@/lib/organic';
import {pageMetadata} from '@/lib/metadata';

const path='/areas';
export const metadata=pageMetadata(path,'Áreas oficiais das obras públicas | Radar de Obras','Explore obras do cadastro Obrasgov por área oficial, como Educação, Saúde, Rodovia e Defesa Civil, com links para cada ficha.');
export default function AreasPage(){return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Áreas',path}]}>
 <PageSchema path={path} name="Áreas oficiais das obras públicas" description="Projetos agrupados pelo tipo oficial declarado no cadastro Obrasgov."/>
 <Structured data={{'@context':'https://schema.org','@type':'ItemList',itemListElement:areas.map((area,index)=>({'@type':'ListItem',position:index+1,name:area.label,url:`${ORIGIN}${path}/${area.slug}`}))}}/>
 <header className="area-hero"><div className="eyebrow">Explorar por assunto</div><h1>Obras por área oficial</h1><p className="lead">Encontre projetos de Educação, Saúde, Rodovia e outras áreas informadas no Obrasgov. Um projeto pode pertencer a mais de uma área.</p></header>
 <div className="area-grid">{areas.map(area=><Link href={`${path}/${area.slug}`} className="area-card" key={area.slug}><span className="area-card-label">{area.label}</span><strong>{area.count.toLocaleString('pt-BR')} projetos</strong><small>Explorar fichas →</small></Link>)}</div>
 <p className="context-note">O agrupamento reproduz o campo “tipo” da classificação oficial. Não indica a natureza exata de cada contrato nem comprova que a obra esteja em andamento. Contagens da carga preservada, atualizadas junto com o site.</p>
 </DiscoveryShell>}
