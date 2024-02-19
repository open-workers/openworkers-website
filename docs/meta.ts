/**
 * Wrapper for markdown modules to decode base64 content.
 */
function md(loader: () => Promise<IMarkdownModule>): () => Promise<IMarkdownModule> {
  return () =>
    loader().then((module) => {
      const { toc, metadata, parsed: base64 } = module;

      const parsed = atob(base64);

      return {
        metadata,
        parsed,
        toc
      };
    });
}

export const docsConfig: IMarkdownMeta[] = [
  {
    name: 'Introduction',
    path: 'index',
    load: md(() => import('./index.md'))
  },
  {
    name: 'Roadmap',
    path: 'roadmap',
    load: md(() => import('./roadmap.md'))
  },
  {
    name: 'Runtime',
    path: 'runtime',
    load: md(() => import('./runtime.md'))
  },
  {
    name: 'ChatGPT example prompt',
    path: 'chat-gpt-prompt',
    load: md(() => import('./chat-gpt-prompt.md'))
  },
  {
    name: 'Examples',
    path: 'examples',
    children: [
      {
        name: 'Poll App',
        path: 'poll',
        load: md(() => import('./examples/poll.md'))
      },
      {
        name: 'Telegram Bot',
        path: 'telegram',
        load: md(() => import('./examples/telegram.md'))
      },
      {
        name: 'QR Code Generator',
        path: 'qr-code',
        load: md(() => import('./examples/qr-code.md'))
      },
      {
        name: 'S3 Proxy',
        path: 's3-proxy',
        load: md(() => import('./examples/s3-proxy.md'))
      },
      {
        name: 'S3 Proxy with AWSv4',
        path: 's3-proxy-aws-v4',
        load: md(() => import('./examples/s3-proxy-aws-v4.md'))
      }
    ]
  },
  {
    name: 'Packages',
    path: 'packages',
    children: [
      {
        external: true,
        name: 'redis-fetch',
        path: 'redis-fetch',
        ghSource: 'https://github.com/openworkers/redis-fetch/blob/main/README.md',
        load: md(() => import('https://raw.githubusercontent.com/openworkers/redis-fetch/main/README.md'))
      },
      {
        external: true,
        name: 'redis-fetch-server',
        path: 'redis-fetch-server',
        ghSource: 'https://github.com/openworkers/redis-fetch-server/blob/main/README.md',
        load: md(() => import('https://raw.githubusercontent.com/openworkers/redis-fetch-server/main/README.md'))
      }
    ]
  }
];
