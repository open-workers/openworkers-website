import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { ListNode, TextNode, ListItemNode } from 'rehype-toc';
import { map, mergeMap, Observable, ReplaySubject } from 'rxjs';
import { unified } from 'unified';
import { IHydrateMarkdownMeta } from '~/app/types/markdown';
import { DocsConfig } from './tokens';
import { CommonModule } from '@angular/common';
import { loginUrl } from '~/environment';

interface TocItem {
  name: string;
  fragment: string;
  children: TocItem[] | null;
}

/**
 * Extracts the table of contents from the rehype-toc tree.
 */
function tocValuesToJson(list: ListNode, depth = 0): TocItem[] | null {
  // If there are no children, we can return null.
  if (!list.children?.length) {
    return null;
  }

  // If there is only one top level item, we can skip the top level and just use the children (if any).
  if (!depth && list.children.length === 1) {
    // If there are no children, we can return null.
    if (!list.children[0].children[1]) {
      return null;
    }

    return tocValuesToJson(list.children[0].children[1] as ListNode, depth + 1);
  }

  // Otherwise, we need to map the children to the TocItem[] structure.
  return list.children.map((li) => {
    const listItem = li.children[0] as ListItemNode;
    const subList = (li.children[1] as ListNode) ?? null;
    const text = listItem.children[0] as TextNode;

    return {
      name: text.value,
      fragment: listItem.properties['href']?.replace('#', '') ?? '',
      children: subList && tocValuesToJson(subList, depth + 1)
    };
  });
}

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

  markdown$: Observable<SafeHtml>;

  public readonly toc$: Observable<TocItem[] | null>;
  public readonly fragment$: Observable<string | null>;
  public readonly ghSource$: Observable<string | null>;

  constructor(
    route: ActivatedRoute,
    sanitizer: DomSanitizer,
    @Inject(DocsConfig) public readonly config: IHydrateMarkdownMeta[]
  ) {
    const toc$$ = new ReplaySubject(1);

    this.toc$ = toc$$.pipe(map((toc) => tocValuesToJson(toc as ListNode)));

    this.fragment$ = route.fragment;

    const markdown$ = route.data.pipe(
      map((data) => data['document'] as string),
      mergeMap((document) =>
        unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkBreaks)
          .use(remarkRehype)
          .use(rehypeSlug)
          .use(rehypeToc, {
            nav: false,
            headings: ['h1', 'h2'],
            // Return false to prevent the default behavior of adding the TOC to the document.
            customizeTOC: (toc) => (toc$$.next(toc), false)
          })
          .use(rehypeHighlight)
          .use(rehypeStringify)
          .process(document)
      )
    );

    this.markdown$ = markdown$.pipe(map((document) => sanitizer.bypassSecurityTrustHtml(document.toString())));

    // Current config item.
    const config$ = route.url.pipe(
      map((url) => url.map((u) => u.path).join('/')),
      map((url) => flattenConfig(config).find(({ path, ghSource }) => (path ?? ghSource ?? '').includes(url)) ?? null)
    );

    this.ghSource$ = config$.pipe(map((config) => config?.ghSource ?? null));
  }
}
