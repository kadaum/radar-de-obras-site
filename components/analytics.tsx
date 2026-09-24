'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const MEASUREMENT_ID = 'G-0PDCFQQGBC';

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
};

function initializeAnalytics() {
  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.dataLayer ||= [];
  analyticsWindow.gtag ||= (...args: unknown[]) => {
    analyticsWindow.dataLayer?.push(args);
  };

  if (!document.querySelector(`script[data-google-analytics="${MEASUREMENT_ID}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.dataset.googleAnalytics = MEASUREMENT_ID;
    document.head.appendChild(script);

    analyticsWindow.gtag('js', new Date());
    analyticsWindow.gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  return analyticsWindow.gtag;
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname || '/';
    initializeAnalytics()?.('event', 'page_view', {
      send_to: MEASUREMENT_ID,
      page_location: `${window.location.origin}${path}`,
      page_path: path,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLElement>('[data-analytics-action]');
      const action = link?.dataset.analyticsAction;
      if (!action || !['abrir_ficha','explorar_mapa','abrir_fonte','exportar_dados','comparar_cidades','abrir_labs'].includes(action)) return;
      initializeAnalytics()?.('event', action, { send_to: MEASUREMENT_ID, page_path: window.location.pathname });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
