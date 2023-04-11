import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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

interface TocItem {
  name: string;
  fragment: string;
  children: TocItem[] | null;
}

/**
 * Extract TocItem[] from AST Structure: ol -> li -> a -> text (name)
 */
function tocValuesToJson(list: ListNode): TocItem[] | null {
  if (!list.children || list.children.length < 2) {
    return null;
  }

  return list.children.map((li) => {
    const listItem = li.children[0] as ListItemNode;
    const subList = (li.children[1] as ListNode) ?? null;
    const text = listItem.children[0] as TextNode;

    return {
      name: text.value,
      fragment: listItem.properties['href']?.replace('#', '') ?? '',
      children: subList && tocValuesToJson(subList)
    };
  });
}

@Component({ templateUrl: './docs.page.html' })
export class DocsPage {
  markdown$: Observable<SafeHtml>;

  public readonly toc$: Observable<TocItem[] | null>;
  public readonly fragment$: Observable<string | null>;

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
  }
}
