import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsConfig } from './pages/docs/tokens';
import docsConfig from '~/docs/meta.json';
import { IHydrateMarkdownMeta, IMarkdownMeta } from './types/markdown';
import { DocsPage } from './pages/docs/docs.page';
import { MarkdownService } from './services/markdown.service';
import { docsUrl } from '~/environments/environment';

function hydrateMarkdownMeta(meta: IMarkdownMeta[], parentPath: string, ghSource?: string): IHydrateMarkdownMeta[] {
  return meta.map(({ name, path, children }) => ({
    name,
    path: `${parentPath}/${path === 'index' ? '' : path}`,
    ghSource: ghSource && `${ghSource}/${path}.md`,
    children: children && hydrateMarkdownMeta(children, `${parentPath}/${path}`, ghSource)
  }));
}

function extractMarkdownRoutes(config: IMarkdownMeta[], parentPath = ''): string[] {
  return config.reduce<string[]>(
    (acc, { path, children }) =>
      children
        ? [...acc, ...extractMarkdownRoutes(children, parentPath + '/' + path)]
        : [...acc, parentPath + '/' + path],
    []
  );
}

function createRoutes(basePath: string, sourceUrl: string, config: IMarkdownMeta[], ghRoot?: string): Routes {
  return extractMarkdownRoutes(config).map((path) => ({
    path: (basePath + path).replace(/\/index$/, ''),
    loadComponent: () => import('./pages/docs/docs.page').then((m) => m.DocsPage),
    providers: [
      {
        provide: DocsConfig,
        useValue: hydrateMarkdownMeta(docsConfig, `/${basePath}`, ghRoot)
      }
    ],
    resolve: {
      document: () => inject(MarkdownService).resolveMarkdown(`${sourceUrl}${path}.md`)
    }
  }));
}

createRoutes('docs', docsUrl, docsConfig);

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main/main.page')
  },
  ...createRoutes(
    'docs',
    docsUrl,
    docsConfig,
    'https://github.com/openworkers-org/openworkers-website/tree/master/docs'
  )
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
export class MainRoutingModule {}
