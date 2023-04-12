import { Component } from '@angular/core';
import { loginUrl, buildId } from '~/environment';

@Component({
  selector: 'main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  public readonly projectUrl = 'https://github.com/openworkers-org/openworkers-website/commit/';
  public readonly loginUrl = loginUrl;
  public readonly buildId = buildId;
}
