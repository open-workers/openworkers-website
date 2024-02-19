import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouteDataService {
  public readonly data$: Observable<IRouteData>;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    this.data$ = router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
      shareReplay(1)
    );
  }
}
