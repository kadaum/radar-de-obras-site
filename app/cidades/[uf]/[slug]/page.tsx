import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DiscoveryShell, PageSchema, Structured } from '@/components/discovery';
import { WorkTable } from '@/components/work-table';
import { ORIGIN, cityPath, data, getCity, workPath } from '@/lib/organic';
import {pageMetadata} from '@/lib/metadata';

type Props = {params:Promise<{uf:string;slug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({params,searchParams}:Props):Promise<Metadata> {
  const {uf,slug}=await params; const city=getCity(uf,slug); if(!city)return {};
  const query=await searchParams; const filtered=Object.keys(query).length>0;
  return pageMetadata(cityPath(city),`Cadastros de obras em ${city.name}, ${city.uf}`,`${city.rows.length.toLocaleString('pt-BR')} registros associados a ${city.name}/${city.uf} no snapshot Obrasgov. Consulte situação, responsável, previsão e fonte.`,filtered?{index:false,follow:true}:undefined);
}
export default async function CityPage({params,searchParams}:Props) {
  const {uf,slug}=await params; const city=getCity(uf,slug); if(!city)notFound();
  const query=await searchParams;
  const q=typeof query.q==='string'?query.q.trim().slice(0,100):'';
  const status=typeof query.situacao==='string'?query.situacao:'';
  const statuses=[...new Set(city.rows.map(row=>row.status).filter(Boolean))].sort();
  const pageRaw=typeof query.pagina==='string'?Number(query.pagina):1;
  if(!Number.isInteger(pageRaw)||pageRaw<1||pageRaw>1000)notFound();
  const page=pageRaw;
  const filtered=city.rows.filter(row=>(!status||row.status===status)&&(!q||`${row.name} ${row.id} ${row.organization||''} ${row.address||''}`.toLocaleLowerCase('pt-BR').includes(q.toLocaleLowerCase('pt-BR'))));
  const pageSize=25; const countPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  if(page>countPages)notFound();
  const shown=filtered.slice((page-1)*pageSize,page*pageSize);
  const path=cityPath(city); const title=`Cadastros de obras em ${city.name}, ${city.uf}`;
  const makePage=(n:number)=>{const p=new URLSearchParams();if(status)p.set('situacao',status);if(q)p.set('q',q);if(n>1)p.set('pagina',String(n));return `${path}${p.size?'?'+p:''}`};
  const countMap=new Map<string,number>();for(const row of city.rows){const label=row.status||'Não informada';countMap.set(label,(countMap.get(label)||0)+1)}
  const counts=[...countMap].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count);
  return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Cidades',path:'/cidades'},{name:`${city.name}, ${city.uf}`,path}]}>
    <PageSchema path={path} name={title} description={`${city.rows.length} registros associados à geometria informada para ${city.name}/${city.uf} no snapshot Obrasgov.`} />
    <Structured data={{'@context':'https://schema.org','@type':'ItemList','@id':`${ORIGIN}${path}#fichas`,itemListElement:city.ids.map((id,index)=>({'@type':'ListItem',position:index+1,url:`${ORIGIN}${workPath(id)}`}))}} />
    <div className="eyebrow">{city.uf} · Snapshot Obrasgov</div><h1>{title}</h1>
    <p className="lead"><strong>{city.rows.length.toLocaleString('pt-BR')} registros</strong> têm {city.name}/{city.uf} como município na geometria publicada pela fonte e aparecem no snapshot do mapa. Isso descreve o cadastro consultado, não todas as obras existentes no município.</p>
    <div className="fact-grid"><div><span>Registros neste recorte</span><strong>{city.rows.length.toLocaleString('pt-BR')}</strong></div><div><span>Com valor positivo informado</span><strong>{city.rows.filter(row=>typeof row.investmentTotal==='number'&&row.investmentTotal>0).length.toLocaleString('pt-BR')}</strong></div><div><span>Coleta dos projetos</span><strong>{new Date(data.source.collectedAt).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</strong></div></div>
    <p className="context-note">Situações registradas: {counts.map(item=>`${item.label}: ${item.count.toLocaleString('pt-BR')}`).join(' · ')}. Datas são previsões ou datas informadas, sem verificação independente do andamento. Valores são investimentos previstos, não gastos.</p>
    <div className="section-heading"><div><h2>Fichas verificadas do piloto</h2><p>Dois projetos com detalhes consultados na API oficial.</p></div><Link href="/guia-de-interpretacao">Como ler os campos →</Link></div>
    <div className="pilot-links">{city.ids.map(id=>{const row=city.rows.find(item=>item.id===id)!;return <Link key={id} href={workPath(id)} data-analytics-action="abrir_ficha"><strong>{row.name}</strong><span>ID {id} · {row.status}</span></Link>})}</div>
    <div className="section-heading"><div><h2>Tabela de registros</h2><p>{filtered.length.toLocaleString('pt-BR')} resultado(s) com os filtros atuais. Outros projetos abrem a fonte oficial.</p></div><Link href="/">Explorar no mapa →</Link></div>
    <form className="filter-bar" method="get" action={path}><label>Buscar nome, ID, órgão ou endereço<input name="q" type="search" defaultValue={q} placeholder="Ex.: escola, hospital, ID" /></label><label>Situação informada<select name="situacao" defaultValue={status}><option value="">Todas</option>{statuses.map(item=><option key={item} value={item}>{item}</option>)}</select></label><button type="submit">Filtrar</button><Link href={path}>Limpar</Link></form>
    {shown.length?<WorkTable rows={shown}/>:<p className="empty-state">Nenhum registro corresponde aos filtros. <Link href={path}>Ver todos</Link>.</p>}
    <nav className="pagination" aria-label="Páginas da tabela"><span>Página {page} de {countPages}</span>{page>1&&<Link href={makePage(page-1)}>← Anterior</Link>}{page<countPages&&<Link href={makePage(page+1)}>Próxima →</Link>}</nav>
    <p className="context-note">Município e coordenada são os campos recebidos da fonte. Alguns pontos podem indicar sede administrativa ou referência aproximada. <Link href="/metodologia">Veja a metodologia</Link> e <Link href="/dados">baixe o piloto</Link>.</p>
  </DiscoveryShell>;
}
