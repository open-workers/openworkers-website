import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const GTAG_ID = 'G-X7QPRFBML9';

@Injectable()
export class GtagService {
  constructor(@Inject(PLATFORM_ID) platform: object, router: Router) {
    if (isPlatformServer(platform) || location.hostname === 'localhost') {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GTAG_ID;
    script.type = 'text/javascript';
    script.async = true;

    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', GTAG_ID);

    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => gtag('config', GTAG_ID, { page_path: event.urlAfterRedirects }));
  }
}
