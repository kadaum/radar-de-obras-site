import Link from 'next/link';
import {pageMetadata} from '@/lib/metadata';

export const metadata=pageMetadata('/','Radar de Obras — Infraestrutura pública no mapa','Explore cadastros públicos de obras no mapa, confira prazos, valores, fontes e atualização.');

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({'@context':'https://schema.org','@type':'WebSite','@id':'https://radar-obras.ricardoguia.com/#website',name:'Radar de Obras',url:'https://radar-obras.ricardoguia.com/',inLanguage:'pt-BR'}) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Radar de Obras',
          url: 'https://radar-obras.ricardoguia.com',
          description: 'Mapa para localizar e comparar cadastros públicos de obras e infraestrutura no Brasil.',
          applicationCategory: 'Public data map',
          operatingSystem: 'Web',
          isAccessibleForFree: true,
          author: { '@type': 'Person', name: 'Ricardo Guia', url: 'https://ricardoguia.com' },
        }) }}
      />
      <main className="site-shell">
        <nav className="map-topbar" aria-label="Explorar o Radar"><h1><Link className="map-topbar-brand" href="/">◈ Radar de Obras</Link></h1><div><Link href="/cidades">Cidades</Link><Link href="/obras">Fichas</Link><Link href="/dados">Dados</Link><Link href="/metodologia">Metodologia</Link></div></nav>
        <iframe title="Radar de Obras" src="/radar.html" className="radar-frame" allow="geolocation" />
      </main>
    </>
  );
}
