import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MainComponent } from './app/main.component';

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApplication(MainComponent, appConfig).catch((err) => console.error(err));
});
