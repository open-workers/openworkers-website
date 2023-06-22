import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable()
export class MarkdownService {
  constructor(private http: HttpClient) {}

  private getMarkdown(url: string) {
    return this.http
      .get(url, {
        responseType: 'text'
      })
      .pipe(
        catchError((err) => {
          console.warn('Error loading markdown', err);
          return of('Error');
        })
      );
  }

  public resolveMarkdown(url: string): Observable<string> {
    return this.getMarkdown(url);
  }
}
