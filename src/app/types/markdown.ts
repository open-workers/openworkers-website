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
export interface IMarkdownMeta {
  name: string; // Title
  path: string; // Relative path
  ghSource?: string; // GitHub repository
  children?: IMarkdownMeta[];
}

export interface IHydrateMarkdownMeta {
  name: string; // Title
  path: string; // Full path
  ghSource?: string; // GitHub path to file (ghSource + path)
  children?: IHydrateMarkdownMeta[];
}
