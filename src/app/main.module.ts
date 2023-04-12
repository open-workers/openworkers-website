import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainRoutingModule } from './routing.module';
import { MainComponent } from './main.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DocsPage } from './components/docs/docs.page';

@NgModule({
  declarations: [MainComponent, DocsPage],
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
