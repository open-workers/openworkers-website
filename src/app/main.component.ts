import { Component } from '@angular/core';
import { loginUrl } from '~/environment';

@Component({
  selector: 'main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  public readonly loginUrl = loginUrl;
}
