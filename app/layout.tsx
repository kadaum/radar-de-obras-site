import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://radar-obras.ricardoguia.com'),
  title: 'Radar de Obras — Infraestrutura pública no mapa',
  description: 'Explore cadastros públicos de obras no mapa, confira prazos, valores, fontes e atualização.',
  alternates: { canonical: '/' },
  applicationName: 'Radar de Obras',
  keywords: ['obras públicas', 'infraestrutura', 'Obrasgov', 'mapa de obras', 'dados públicos', 'Brasil'],
  authors: [{ name: 'Ricardo Guia', url: 'https://ricardoguia.com' }],
  creator: 'Ricardo Guia',
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Radar de Obras',
    title: 'Radar de Obras — Infraestrutura pública no mapa',
    description: 'Localize e compare cadastros públicos de obras no Brasil, com prazos, valores e acesso à fonte oficial.',
    images: [{ url: '/og-radar.png', width: 1200, height: 630, alt: 'Radar de Obras — infraestrutura pública no mapa do Brasil' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radar de Obras — Infraestrutura pública no mapa',
    description: 'Localize e compare cadastros públicos de obras no Brasil, com acesso à fonte oficial.',
    images: ['/og-radar.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
