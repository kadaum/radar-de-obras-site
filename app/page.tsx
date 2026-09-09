export default function Home() {
  return (
    <>
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
        <iframe title="Radar de Obras" src="/radar.html" className="radar-frame" allow="geolocation" />
      </main>
    </>
  );
}
