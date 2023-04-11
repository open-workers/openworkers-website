import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { IMarkdownMeta } from '../types/markdown';

@Injectable()
export class MarkdownService {
  constructor(private http: HttpClient) {}

  public getMarkdownMeta(url: string) {
    return this.http.get<IMarkdownMeta[]>(url).pipe(
      catchError((err) => {
        console.warn(err);
        return of(null);
      })
    );
  }

  public getMarkdown(url: string) {
    return this.http
      .get(url, {
        responseType: 'text'
      })
      .pipe(
        catchError((err) => {
          console.warn(err);
          return of('Error');
        })
      );
  }

  public resolveMarkdown(url: string): Observable<string> {
    console.log(url);
    return this.getMarkdown(url);
  }
}
