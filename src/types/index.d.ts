declare global {
  interface IArticleMetadata {
    title: string;
    keywords?: string;
    description?: string;
    date: string;
    link: string;
  }

  interface IRouteData {
    // Layout
    fullScreen?: boolean;

    // Metadata
    title?: string;
    keywords?: string;
    description?: string;
    date?: string;
  }

  interface ITocItem {
    name: string;
    fragment: string;
    children: ITocItem[] | null;
  }

  interface IMarkdownModule {
    metadata: IArticleMetadata;
    parsed: string;
    toc: ITocItem[];
  }
}

export {};
