import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Optional } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CardComponent } from '~/app/components/card/card.component';
import { ConsoleComponent } from '~/app/components/console/console.component';
import { loginUrl } from '~/environment';
import { parsed } from './console.md';

@Component({
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.css'],
  imports: [CommonModule, RouterModule, CardComponent, ConsoleComponent, ReactiveFormsModule],
  standalone: true
})
export default class MainPage {
  public newsletterForm = new FormGroup({ email: new FormControl('', [Validators.required, Validators.email]) });
  public subscribeError?: string;
  public subscribeSuccess?: string;

  public readonly loginUrl = loginUrl;

  public readonly content = atob(parsed);

  constructor(@Optional() private http: HttpClient) {}

  public async subscribe() {
    const form = this.newsletterForm;
    const { email } = form.value;

    if (!email || !/^\S+@\S+\.\S+$/i.test(email)) {
      this.subscribeError = 'Please enter a valid email address';
      return;
    }

    try {
      await firstValueFrom(this.http.post('https://newsletter.workers.rocks/subscribe', { email }));
      this.subscribeSuccess = 'Successfully subscribed to newsletter';
    } catch (err) {
      console.error('Failed to subscribe', email, err);
      this.subscribeError = 'Failed to subscribe to newsletter';
    }
  }
}
