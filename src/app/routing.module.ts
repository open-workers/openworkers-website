import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsConfig } from './pages/docs/tokens';
import docsConfig from '~/docs/meta.json';
import { IHydrateMarkdownMeta, IMarkdownMeta } from './types/markdown';
import { MarkdownService } from './services/markdown.service';
import { docsUrl } from '~/environments/environment';

function mergeMaps<T>(...maps: Map<string, T>[]): Map<string, T> {
  return maps.reduce(
    (acc, map) => Array.from(map.entries()).reduce((acc, [key, value]) => acc.set(key, value), acc),
    new Map()
  );
}

function hydrateMarkdownMeta(meta: IMarkdownMeta[], parentPath: string, ghSource?: string): IHydrateMarkdownMeta[] {
  return meta.map(({ name, path, children, ...meta }) => ({
    name,
    path: `${parentPath}/${path === 'index' ? '' : path}`,
    ghSource:
      ghSource && (meta.external ? meta.ghSource : `${ghSource}/${parentPath}/${path}.md`)?.replace(/!:\/\//g, '/'),
    children: children && hydrateMarkdownMeta(children, `${parentPath}/${path}`, ghSource)
  }));
}

/**
 * Get routes from tree
 */
function extractMarkdownRoutes(config: IMarkdownMeta[], parentPath = ''): Map<string, IMarkdownMeta> {
  return config.reduce<Map<string, IMarkdownMeta>>(
    (acc, meta) =>
      meta.children
        ? mergeMaps(acc, extractMarkdownRoutes(meta.children, parentPath + '/' + meta.path))
        : acc.set(parentPath + '/' + meta.path, meta),
    new Map()
  );
}

function createRoutes(basePath: string, sourceUrl: string, config: IMarkdownMeta[], ghRoot?: string): Routes {
  return Array.from(extractMarkdownRoutes(config)).map(([path, meta]) => {
    return {
      path: (basePath + path).replace(/\/index$/, ''),
      loadComponent: () => import('./pages/docs/docs.page'),
      providers: [
        {
          provide: DocsConfig,
          useValue: hydrateMarkdownMeta(docsConfig, `/${basePath}`, ghRoot)
        }
      ],
      resolve: {
        document: () =>
          inject(MarkdownService).resolveMarkdown(
            meta.external
              ? meta.ghSource!.replace('https://github.com', 'https://raw.githubusercontent.com').replace('/blob', '')
              : `${sourceUrl}${path}.md`
          )
      }
    };
  });
}

createRoutes('docs', docsUrl, docsConfig);

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main/main.page')
  },
  ...createRoutes('docs', docsUrl, docsConfig, 'https://github.com/openworkers/openworkers-website/tree/master'),
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
      onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 96]
    })
  ],
  exports: [RouterModule]
})
export class MainRoutingModule { }
