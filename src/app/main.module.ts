import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainRoutingModule } from './routing.module';
import { MainComponent } from './main.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MarkdownService } from './services/markdown.service';
import { GtagService } from './services/gtag.service';

@NgModule({
  providers: [
    MarkdownService,
    GtagService,
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [GtagService],
      multi: true
    }
  ],
  declarations: [MainComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    MainRoutingModule,
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  bootstrap: [MainComponent]
})
export class MainModule {}
