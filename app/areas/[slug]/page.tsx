import Link from 'next/link';
import {notFound} from 'next/navigation';
import {DiscoveryShell,PageSchema,Structured} from '@/components/discovery';
import {areas,areaRows} from '@/lib/official-areas-data';
import {ORIGIN,formatMoney,workPath} from '@/lib/organic';
import {pageMetadata} from '@/lib/metadata';
import manifest from '@/lib/official-areas.json';

type Props={params:Promise<{slug:string}>;searchParams:Promise<{pagina?:string;uf?:string;q?:string}>};
const size=50;
const normalized=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const readable=(value:string)=>value.replaceAll('\u0096','–').replaceAll('\u0093','“').replaceAll('\u0094','”');
export async function generateMetadata({params,searchParams}:Props){
 const {slug}=await params;const area=areas.find(x=>x.slug===slug);if(!area)return {};
 const query=await searchParams;
 const page=Number(query.pagina||'1');const filtered=!!(query.uf||query.q);
 const path=`/areas/${slug}`;
 return pageMetadata(path,`${area.label}: obras e projetos públicos | Radar de Obras`,`Consulte ${area.count.toLocaleString('pt-BR')} projetos classificados oficialmente como ${area.label} no Obrasgov. Busque por município, UF ou nome da obra.`,{index:!filtered&&page===1,follow:true});
}
export default async function AreaPage({params,searchParams}:Props){
 const {slug}=await params;const area=areas.find(x=>x.slug===slug);if(!area)notFound();
 const query=await searchParams;const page=Number(query.pagina||'1');
 const uf=(query.uf||'').toUpperCase();const q=(query.q||'').trim().slice(0,80);
 if(!Number.isSafeInteger(page)||page<1||!/^$|^[A-Z]{2}$/.test(uf))notFound();
 const all=await areaRows(area);
 const rows=all.filter(row=>(!uf||row[3]===uf)&&(!q||normalized(`${row[1]} ${row[2]||''} ${row[0]}`).includes(normalized(q))));
 const pages=Math.max(1,Math.ceil(rows.length/size));if(page>pages)notFound();
 const path=`/areas/${slug}`;
 const href=(n:number)=>`${path}?${new URLSearchParams({...uf?{uf}:{},...q?{q}:{},pagina:String(n)}).toString()}`;
 const visible=rows.slice((page-1)*size,page*size);
 return <DiscoveryShell crumbs={[{name:'Início',path:'/'},{name:'Áreas',path:'/areas'},{name:area.label,path}]}>
  <PageSchema path={path} name={`Obras de ${area.label}`} description={`Classificação oficial Obrasgov: ${area.label}. ${area.count.toLocaleString('pt-BR')} projetos na carga ${manifest.sourceLoad}.`}/>
  <header className="area-hero"><div className="eyebrow">Classificação oficial · Obrasgov</div><h1>Obras de {area.label}</h1><p className="lead">{area.count.toLocaleString('pt-BR')} projetos nesta área na carga pública. Consulte situação, valor previsto e fontes na ficha de cada obra.</p></header>
  <div className="area-summary"><div><span>Área no cadastro</span><strong>{area.label}</strong></div><div><span>Projetos relacionados</span><strong>{area.count.toLocaleString('pt-BR')}</strong></div><div><span>Estados com mais registros</span><strong>{area.states.slice(0,3).map(([state])=>state).join(' · ')}</strong></div></div>
  <form className="area-filter" action={path} method="get"><label>Nome, município ou ID<input type="search" name="q" defaultValue={q} maxLength={80} placeholder="Buscar nesta área" /></label><label>Estado<select name="uf" defaultValue={uf}><option value="">Todos</option>{area.states.map(([state])=><option value={state} key={state}>{state}</option>)}</select></label><button type="submit">Buscar obras</button>{(q||uf)&&<Link href={path}>Limpar filtros</Link>}</form>
  <p className="area-result-count">{rows.length.toLocaleString('pt-BR')} {rows.length===1?'resultado':'resultados'}{rows.length>0&&` · página ${page} de ${pages}`}</p>
  {visible.length?<><Structured data={{'@context':'https://schema.org','@type':'ItemList',itemListElement:visible.map((row,index)=>({'@type':'ListItem',position:(page-1)*size+index+1,name:row[1],url:`${ORIGIN}${workPath(row[0])}`}))}}/>
   <div className="area-results">{visible.map(row=><article className="area-result" key={row[0]}><div><span>{row[3]||'UF não informada'} · {row[2]||'Município não informado'} · ID {row[0]}</span><h2><Link href={workPath(row[0])}>{readable(row[1]||`Projeto ${row[0]}`)}</Link></h2><p>{row[4]||'Situação não informada'}</p></div><div className="area-result-money"><span>Investimento previsto</span><strong>{formatMoney(row[5])}</strong></div></article>)}</div>
   <nav className="area-pagination" aria-label="Páginas desta área">{page>1&&<Link href={page===2&&!uf&&!q?path:href(page-1)}>← Anterior</Link>}<span>Página {page} de {pages}</span>{page<pages&&<Link href={href(page+1)}>Próxima →</Link>}</nav></>:<p className="area-empty">Nenhuma obra encontrada com esses termos. Tente outro nome, município ou estado.</p>}
  <p className="context-note">“{area.label}” é o tipo declarado pelo órgão no cadastro Obrasgov; a classificação pode ser ampla. Um projeto pode aparecer em mais de uma área. Valores são investimentos previstos, não pagamentos. Situação e endereço podem estar desatualizados ou aproximados.</p>
 </DiscoveryShell>;
}
