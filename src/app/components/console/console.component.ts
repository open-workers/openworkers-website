import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private sanitizer: DomSanitizer, route: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      const content = changes['content'].currentValue as string;

      // We are parsing html here, pure luck that it works
      this.lines = content
        .split('\n')
        .filter(Boolean)
        .map((_, index) => index + 1);

      this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(content);
    }
  }
}
