import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { loginUrl } from '~/environment';
import { DocsConfig } from './tokens';

/**
 * Flattens the config to a single level.
 */
function flattenConfig(config: IHydrateMarkdownMeta[]): IHydrateMarkdownMeta[] {
  return config.reduce<IHydrateMarkdownMeta[]>((acc, { children, ...rest }) => {
    if (children) {
      return [...acc, ...flattenConfig(children), rest];
    }

    return [...acc, rest];
  }, []);
}

@Component({
  templateUrl: './docs.page.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export default class DocsPage {
  public readonly loginUrl = loginUrl;

  public readonly markdown$: Observable<SafeHtml>;

  public readonly toc$: Observable<ITocItem[] | null>;
  public readonly fragment$: Observable<string | null>;
  public readonly ghSource$: Observable<string | null>;

  constructor(
    route: ActivatedRoute,
    sanitizer: DomSanitizer,
    @Inject(DocsConfig) public readonly config: IHydrateMarkdownMeta[]
  ) {
    this.fragment$ = route.fragment;

    const document$ = route.data.pipe(
      map((data) => data['document']),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.toc$ = document$.pipe(map((document) => document.toc));

    const markdown$ = document$.pipe(map((document) => document.parsed));

    this.markdown$ = markdown$.pipe(map((document) => sanitizer.bypassSecurityTrustHtml(document.toString())));

    // Current config item.
    const config$ = route.url.pipe(
      map((url) => url.map((u) => u.path).join('/')),
      map((url) => flattenConfig(config).find(({ path, ghSource }) => (path ?? ghSource ?? '').includes(url)) ?? null)
    );

    this.ghSource$ = config$.pipe(map((config) => config?.ghSource ?? null));
  }
}
