import { InjectionToken } from '@angular/core';
import { IHydrateMarkdownMeta } from '~/app/types/markdown';

export const DocsConfig = new InjectionToken<IHydrateMarkdownMeta[]>('DOCS_CONFIG');
