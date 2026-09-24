import Link from 'next/link';
import { DiscoveryShell, PageSchema, Structured } from '@/components/discovery';
import { data, cityPath, ORIGIN } from '@/lib/organic';
import {pageMetadata} from '@/lib/metadata';

export const metadata=pageMetadata('/cidades','Cidades no Radar de Obras','Explore cinco cidades piloto com cadastros de projetos do snapshot Obrasgov, fontes, situação e contexto de cobertura.');
export default function Cities() {
  const path='/cidades';
  return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Cidades',path}]}>
    <PageSchema path={path} name="Cidades no Radar de Obras" description="Cinco cidades piloto com registros associados à geometria informada no snapshot Obrasgov." />
    <Structured data={{'@context':'https://schema.org','@type':'ItemList','@id':`${ORIGIN}${path}#list`,itemListElement:data.cities.map((city,index)=>({'@type':'ListItem',position:index+1,name:`${city.name}, ${city.uf}`,url:`${ORIGIN}${cityPath(city)}`}))}} />
    <div className="eyebrow">Explorar por cidade</div><h1>Cadastros associados a cinco cidades</h1>
    <p className="lead">Cada página reúne registros do snapshot do Radar marcados com o município na geometria da fonte. O vínculo não confirma que o ponto seja o canteiro nem que todos os projetos da cidade estejam cadastrados.</p>
    <div className="city-grid">{data.cities.map(city=><Link className="city-card" key={city.slug} href={cityPath(city)}><span className="city-uf">{city.uf}</span><h2>{city.name}</h2><strong>{city.rows.length.toLocaleString('pt-BR')} registros</strong><span>Ver tabela, situação e fichas →</span></Link>)}</div>
    <p className="context-note">Snapshot de projetos coletado em {new Date(data.source.collectedAt).toLocaleDateString('pt-BR',{timeZone:'UTC'})}. <Link href="/metodologia">Entenda o recorte e as limitações.</Link></p>
  </DiscoveryShell>;
}
