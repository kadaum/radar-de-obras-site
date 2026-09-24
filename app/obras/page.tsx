import Link from 'next/link';
import { DiscoveryShell, PageSchema, Structured } from '@/components/discovery';
import { WorkTable } from '@/components/work-table';
import { ORIGIN, cityPath, data, workPath } from '@/lib/organic';
import {pageMetadata} from '@/lib/metadata';

export const metadata=pageMetadata('/obras','Fichas de obras do piloto','Dez fichas de projetos do snapshot Obrasgov, com fonte oficial, datas, situação, responsável e investimento previsto.');
export default function Works() {
  const rows=data.cities.flatMap(city=>city.ids.map(id=>city.rows.find(row=>row.id===id)!));
  return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Fichas',path:'/obras'}]}>
    <PageSchema path="/obras" name="Fichas de obras do piloto" description="Dez projetos selecionados em cinco cidades para leitura detalhada de dados oficiais." />
    <Structured data={{'@context':'https://schema.org','@type':'ItemList','@id':`${ORIGIN}/obras#list`,itemListElement:rows.map((row,index)=>({'@type':'ListItem',position:index+1,name:row.name,url:`${ORIGIN}${workPath(row.id)}`}))}} />
    <div className="eyebrow">Piloto · 10 fichas</div><h1>Projetos com fonte e contexto</h1><p className="lead">Estas fichas mostram o que o cadastro Obrasgov informa sobre cada projeto. O andamento não é verificado em campo e uma previsão vencida, isoladamente, não comprova atraso.</p>
    <div className="city-chips">{data.cities.map(city=><Link key={city.slug} href={cityPath(city)}>{city.name} <span>{city.uf}</span></Link>)}</div>
    <WorkTable rows={rows} selectedOnly />
    <p className="context-note">Os campos principais vêm do snapshot de projetos coletado em {new Date(data.source.collectedAt).toLocaleDateString('pt-BR',{timeZone:'UTC'})}. As fichas identificam separadamente a consulta complementar. <Link href="/metodologia">Metodologia e limitações.</Link></p>
  </DiscoveryShell>;
}
