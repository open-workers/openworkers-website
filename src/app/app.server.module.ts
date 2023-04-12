import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { MainModule } from './main.module';
import { MainComponent } from './main.component';

@NgModule({
  imports: [MainModule, ServerModule],
  bootstrap: [MainComponent]
})
export class AppServerModule {}
