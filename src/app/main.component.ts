import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { loginUrl, buildId } from '~/environment';

@Component({
  selector: 'main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  public readonly projectUrl = 'https://github.com/openworkers-org/openworkers-website/commit/';
  public readonly loginUrl = loginUrl;
  public readonly buildId = buildId;

  public readonly isMainPage$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.url === '/')
  );

  constructor(private router: Router) {}
}
