interface _BaseMeta {
  name: string; // Title
  path: string; // Relative path
  children?: never;
  load?: never;
}

interface _ExternalMeta extends _BaseMeta {
  external: true; // External link - no children, no path, ghSource must be set
  ghSource: string;
  children?: never;
  load?: () => Promise<IMarkdownModule>;
}

interface _LocalMeta extends _BaseMeta {
  external?: false;
  load?: () => Promise<IMarkdownModule>;
}

interface _IndexMeta extends _BaseMeta {
  external?: false;
  children: IMarkdownMeta[];
}

declare global {
  /**
   * Example:
   * [
   *   {
   *     "name": "Introduction",
   *     "path": "index"
   *   },
   *   {
   *     "name": "Get started",
   *     "path": "start"
   *   },
   *   {
   *     "name": "Runtime",
   *     "path": "runtime"
   *   },
   *   {
   *     "name": "Examples",
   *     "path": "examples",
   *     "children": [
   *       {
   *         "name": "Telegram bot",
   *         "path": "telegram"
   *       },
   *       {
   *         "name": "QR code generator",
   *         "path": "qr-code"
   *       }
   *     ]
   *   },
   *   {
   *     "name": "Packages",
   *     "path": "packages",
   *     "children": [
   *       {
   *         "name": "redis-fetch",
   *         "path": "redis-fetch"
   *       },
   *       {
   *         "name": "redis-fetch-server",
   *         "path": "redis-fetch-server"
   *       }
   *     ]
   *   }
   * ]
   */
  type IMarkdownMeta = _ExternalMeta | _LocalMeta | _IndexMeta;

  interface IHydrateMarkdownMeta {
    name: string; // Title
    path?: string; // Full path
    ghSource?: string; // GitHub path to file (ghSource + path)
    children?: IHydrateMarkdownMeta[];
  }
}

export {};
