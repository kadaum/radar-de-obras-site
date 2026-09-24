import Link from 'next/link';
import { ORIGIN, breadcrumb, jsonLd } from '@/lib/organic';

export function Structured({ data }: {data: object}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(data)}} />;
}
export function DiscoveryShell({children, crumbs}: {children:React.ReactNode;crumbs?:{name:string;path:string}[]}) {
  return <div className="discovery">
    <header className="discovery-header"><div className="header-inner">
      <Link className="brand" href="/"><span className="brand-mark">◈</span> Radar de Obras</Link>
      <nav aria-label="Navegação principal"><Link href="/cidades">Cidades</Link><Link href="/obras">Fichas</Link><Link href="/dados">Dados</Link><Link href="/metodologia">Metodologia</Link><Link className="map-button" href="/">Abrir mapa</Link></nav>
    </div></header>
    {crumbs && <><Structured data={breadcrumb(crumbs)} /><nav className="breadcrumbs" aria-label="Caminho">{crumbs.map((item,index)=><span key={item.path}>{index>0&&<span aria-hidden="true">/</span>}<Link href={item.path}>{item.name}</Link></span>)}</nav></>}
    <main className="discovery-main">{children}</main>
    <footer className="discovery-footer"><div><strong>Radar de Obras</strong><p>Leitura independente de cadastros públicos. Um registro ausente não prova que uma obra não exista.</p></div><nav aria-label="Links de apoio"><Link href="/guia-de-interpretacao">Como interpretar</Link><Link href="/levantamento" data-analytics-action="comparar_cidades">Levantamento</Link><Link href="/dados">Baixar dados</Link><a href="https://ricardoguia.com/pt/lab" rel="noopener noreferrer" data-analytics-action="abrir_labs">Labs de Ricardo Guia</a></nav></footer>
  </div>;
}
export function PageSchema({path,name,description}: {path:string;name:string;description:string}) {
  return <Structured data={{'@context':'https://schema.org','@type':'WebPage','@id':`${ORIGIN}${path}#page`,url:`${ORIGIN}${path}`,name,description,isPartOf:{'@id':`${ORIGIN}/#website`},inLanguage:'pt-BR'}} />;
}
