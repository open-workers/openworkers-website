import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { MainModule } from './main.module';
import { MainComponent } from './main.component';
import { MarkdownService } from './services/markdown.service';
import { from } from 'rxjs';
import { readFile } from 'fs';
import { resolve } from 'path';

@NgModule({
  providers: [
    {
      provide: MarkdownService,
      useValue: {
        resolveMarkdown(url: string) {
          const path = resolve(url.replace('/static/', ''));

          console.log('Resolving markdown', path);

          return from(
            new Promise<string>((resolve) => {
              readFile(path, { encoding: 'utf8' }, (err, data) => resolve(err ? err.code ?? '' : data));
            })
          );
        }
      }
    }
  ],
  imports: [MainModule, ServerModule],
  bootstrap: [MainComponent]
})
export class AppServerModule {}
