import { Routes } from '@angular/router';
import { DocsConfig } from './pages/docs/tokens';
import { docsUrl } from '~/environments/environment';
import { docsConfig } from '~/docs/meta';

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
        document: meta.load ?? null
      }
    };
  });
}

createRoutes('docs', docsUrl, docsConfig);

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main/main.page')
  },
  ...createRoutes('docs', docsUrl, docsConfig, 'https://github.com/openworkers/openworkers-website/tree/master'),
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.page')
  }
];
