'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const MEASUREMENT_IDS = ['G-0PDCFQQGBC', 'G-JQE2V3JLGL'] as const;

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

  if (!document.querySelector(`script[data-google-analytics="${MEASUREMENT_IDS[0]}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_IDS[0]}`;
    script.dataset.googleAnalytics = MEASUREMENT_IDS[0];
    document.head.appendChild(script);

    analyticsWindow.gtag('js', new Date());
    for (const measurementId of MEASUREMENT_IDS) {
      analyticsWindow.gtag('config', measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
    }
  }

  return analyticsWindow.gtag;
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname || '/';
    const gtag = initializeAnalytics();
    for (const measurementId of MEASUREMENT_IDS) {
      gtag?.('event', 'page_view', {
        send_to: measurementId,
        page_location: `${window.location.origin}${path}`,
        page_path: path,
        page_title: document.title,
      });
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLElement>('[data-analytics-action]');
      const action = link?.dataset.analyticsAction;
      if (!action || !['abrir_ficha','explorar_mapa','abrir_fonte','exportar_dados','comparar_cidades','abrir_labs'].includes(action)) return;
      const gtag = initializeAnalytics();
      for (const measurementId of MEASUREMENT_IDS) {
        gtag?.('event', action, { send_to: measurementId, page_path: window.location.pathname });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
