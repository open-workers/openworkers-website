import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

@Component({
  selector: 'console',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './console.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsoleComponent implements OnChanges {
  @Input()
  title = 'index.ts';

  @Input()
  content?: string;

  lines?: number[];

  public contentHtml?: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['content']) {
      const content = changes['content'].currentValue as string;

      this.lines = content.split('\n').map((_, index) => index + 1);

      const markdown = '```typescript\n' + content + '\n```';

      const document = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkBreaks)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(() => (tree) => {
          console.log(tree);

          tree.children[0] = (tree.children[0] as any).children[0]; // code

          return tree;
        })
        .use(rehypeStringify)
        .processSync(markdown);

      console.log(markdown, document);

      this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(document.toString());
    }
  }
}
