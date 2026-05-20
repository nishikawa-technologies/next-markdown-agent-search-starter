import type { NextConfig } from 'next';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import createNextIntlPlugin from 'next-intl/plugin';

const configDir = path.dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin('./src/libs/I18n.ts');

const contentDir = path.join(process.cwd(), 'content');

/** Dev 時に content/ 配下の Markdown 変更で Fast Refresh を走らせる */
function watchContentDirPlugin() {
  return {
    apply(compiler: {
      hooks: {
        afterCompile: {
          tap: (
            name: string,
            callback: (compilation: { contextDependencies: { add: (dir: string) => void } }) => void,
          ) => void;
        };
      };
    }) {
      compiler.hooks.afterCompile.tap('WatchContentDir', (compilation) => {
        compilation.contextDependencies.add(contentDir);
      });
    },
  };
}

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['.'],
  },
  /** 親ディレクトリに別ロックファイルがあると Next が誤った workspace root を推測することがある */
  outputFileTracingRoot: configDir,
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/company',
        permanent: true,
      },
      {
        source: '/about/',
        destination: '/company/',
        permanent: true,
      },
      {
        source: '/en/about',
        destination: '/en/company',
        permanent: true,
      },
      {
        source: '/en/about/',
        destination: '/en/company/',
        permanent: true,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.plugins = config.plugins ?? [];
      config.plugins.push(watchContentDirPlugin());
    }

    return config;
  },
};

export default withNextIntl(nextConfig);
