import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@/components/analytics';
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
  applicationName: 'Radar de Obras',
  keywords: ['obras públicas', 'infraestrutura', 'Obrasgov', 'mapa de obras', 'dados públicos', 'Brasil'],
  authors: [{ name: 'Ricardo Guia', url: 'https://ricardoguia.com' }],
  creator: 'Ricardo Guia',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' }],
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
        <Analytics />
        {children}
      </body>
    </html>
  );
}
