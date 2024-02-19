import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig
} from '@angular/router';

import { routes } from './app.routes';

import { ViewportScroller } from '@angular/common';
import { provideClientHydration } from '@angular/platform-browser';
import { GtagService } from './services/gtag.service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes, //
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideClientHydration(),
    provideHttpClient(),
    GtagService,
    {
      provide: APP_INITIALIZER,
      useFactory: (viewportScroller: ViewportScroller) => () => {
        viewportScroller.setOffset([0, 96]);
      },
      deps: [ViewportScroller],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [GtagService],
      multi: true
    }
  ]
};
