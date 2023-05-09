import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainRoutingModule } from './routing.module';
import { MainComponent } from './main.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MarkdownService } from './services/markdown.service';

@NgModule({
  providers: [MarkdownService],
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
