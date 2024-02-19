import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { loginUrl, buildId } from '~/environment';

@Component({
  selector: 'main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [CommonModule, RouterOutlet, RouterModule]
})
export class MainComponent {
  public readonly projectUrl = 'https://github.com/openworkers/openworkers-website/commit/';
  public readonly loginUrl = loginUrl;
  public readonly buildId = buildId;

  public readonly isMainPage$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.url === '/')
  );

  constructor(private router: Router) {}
}
