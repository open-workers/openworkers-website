import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Observable, map } from 'rxjs';
import { buildId, loginUrl } from '~/environment';
import { RouteDataService } from './services/route-data.service';

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

  public readonly staticNav$: Observable<any>;

  constructor(routeData: RouteDataService) {
    this.staticNav$ = routeData.data$.pipe(map((data) => data.staticNav === true));
  }
}
