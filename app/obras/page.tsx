import Link from 'next/link';
import { DiscoveryShell, PageSchema, Structured } from '@/components/discovery';
import { WorkTable } from '@/components/work-table';
import { ORIGIN, cityPath, data, workPath } from '@/lib/organic';
import {pageMetadata} from '@/lib/metadata';
import manifest from '@/lib/national-manifest.json';

export const metadata=pageMetadata('/obras','Fichas de obras públicas | Radar de Obras','Consulte fichas do cadastro Obrasgov com tipo oficial, situação, investimento previsto e localização. Explore a base nacional e projetos com contexto adicional.');
export default function Works() {
  const rows=data.cities.flatMap(city=>city.ids.map(id=>city.rows.find(row=>row.id===id)!));
  return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Fichas',path:'/obras'}]}>
    <PageSchema path="/obras" name="Fichas de obras públicas" description="Fichas do cadastro nacional Obrasgov e uma seleção de dez projetos com contexto adicional." />
    <Structured data={{'@context':'https://schema.org','@type':'ItemList','@id':`${ORIGIN}/obras#list`,itemListElement:rows.map((row,index)=>({'@type':'ListItem',position:index+1,name:row.name,url:`${ORIGIN}${workPath(row.id)}`}))}} />
    <div className="eyebrow">Cadastro nacional · {manifest.total.toLocaleString('pt-BR')} projetos</div><h1>Projetos com fonte e contexto</h1><p className="lead">Cada projeto da base tem uma ficha com informações do cadastro Obrasgov. O andamento não é verificado em campo e uma previsão vencida, isoladamente, não comprova atraso.</p>
    <p><Link href="/radar.html?view=list" prefetch={false}>Buscar uma obra na lista nacional →</Link> · <Link href="/areas">Explorar por área oficial →</Link></p>
    <h2>Seleção com contexto adicional</h2><p>Dez projetos em cinco cidades, com revisão de documentos e fontes complementares. A profundidade das informações varia conforme a disponibilidade pública.</p>
    <div className="city-chips">{data.cities.map(city=><Link key={city.slug} href={cityPath(city)}>{city.name} <span>{city.uf}</span></Link>)}</div>
    <WorkTable rows={rows} selectedOnly />
    <p className="context-note">Os campos principais vêm do snapshot de projetos coletado em {new Date(data.source.collectedAt).toLocaleDateString('pt-BR',{timeZone:'UTC'})}. As fichas identificam separadamente a consulta complementar. <Link href="/metodologia">Metodologia e limitações.</Link></p>
  </DiscoveryShell>;
}
