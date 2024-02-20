import { existsSync, mkdir, readFileSync, writeFile, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';

import 'zone.js/node';

import { MainComponent } from './src/app/main.component';
import { routes } from './src/app/app.routes';

import { ApplicationConfig, Provider } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BEFORE_APP_SERIALIZED, provideServerRendering, renderApplication } from '@angular/platform-server';

import { DOCUMENT } from '@angular/common';
import { provideRouter } from '@angular/router';

const distFolder = join(process.cwd(), 'dist/browser');

// Copy index.html to index.original.html if not exists
let indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index.html';
if (indexHtml === 'index.html') {
  copyFileSync(join(distFolder, 'index.html'), join(distFolder, 'index.original.html'));
  indexHtml = 'index.original.html';
}

const documentPath = join(distFolder, indexHtml);
const document = readFileSync(documentPath).toString();

const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);

const cache = new Map<string, string>();

function removeAll<K extends keyof HTMLElementTagNameMap>(nodes: NodeListOf<HTMLElementTagNameMap[K]>) {
  const elements = Array.from(nodes);

  for (const element of elements) {
    element.remove();
  }
}

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideServerRendering(),
    {
      provide: BEFORE_APP_SERIALIZED,
      useFactory: (document: Document) => () => {
        // Remove inlined "critical" styles
        removeAll(document.head.querySelectorAll('style'));

        // Remove noscript > link[rel="stylesheet"] elements
        removeAll(document.head.querySelectorAll('noscript'));

        // Remove style imports and replace them with inlined styles
        const links = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'));
        for (const link of links) {
          const name = link.getAttribute('href');
          link.remove();

          if (!name) {
            console.warn('Missing href attribute on link', link);
            return;
          }

          let css = cache.get(name);

          if (!css) {
            // Reading file and writing it to the final html file
            css = readFileSync(join(distFolder, name))
              .toString()
              // Remove comments
              .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
              // Remove newlines
              .replace(/\n/g, ' ')
              // Remove multiple spaces
              .replace(/\s{2,}/g, ' ');

            cache.set(name, css);
          }

          document.head.appendChild(document.createElement('style')).textContent = css;
        }
      },
      deps: [DOCUMENT],
      multi: true
    }
  ]
};

function render(url: string, platformProviders?: Provider[]) {
  return renderApplication(() => bootstrapApplication(MainComponent, appConfig), {
    url,
    document,
    platformProviders
  });
}

enum Rules {
  DEFAULT,
  GITHUB
}

async function writeHtml(rule: Rules, path: string, html: string) {
  switch (rule) {
    case Rules.DEFAULT: {
      // Create folder if not exists
      const folder = join(distFolder, path);

      if (!existsSync(folder)) {
        await mkdirAsync(folder, { recursive: true });
      }

      await writeFileAsync(join(distFolder, path, 'index.html'), html);

      break;
    }
    // https://stackoverflow.com/questions/33270605/github-pages-trailing-slashes
    case Rules.GITHUB: {
      const parts = path.split('/').filter((part) => part !== '');

      // Parts is empty if path is '/'
      const file = parts.pop() ?? 'index';

      const base = join(...parts);

      const folder = join(distFolder, base);

      if (!existsSync(folder)) {
        await mkdirAsync(folder, { recursive: true });
      }

      await writeFileAsync(join(distFolder, base, `${file}.html`), html);

      break;
    }
  }
}

(async () => {
  for (const route of routes) {
    console.info('Prerendering', route.path ?? route);

    if (typeof route.path !== 'string') {
      console.warn('Skipping route without path', route);
      continue;
    }

    const path = route.path === '**' ? '404' : route.path;

    try {
      const html = await render(path, []);

      await writeHtml(Rules.GITHUB, path, html);
    } catch (err) {
      console.error(`Error rendering ${route}`, err);
    }
  }

  console.info('Done');
})();
