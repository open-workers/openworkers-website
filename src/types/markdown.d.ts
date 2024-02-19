// https://github.com/apollographql/graphql-tag/issues/59#issuecomment-316991007
// https://github.com/storybookjs/storybook/issues/2883#issuecomment-362713860
declare module '*.md' {
  export const toc: ITocItem[];
  export const parsed: string; // base64 encoded string
  export const metadata: IArticleMetadata;
}
