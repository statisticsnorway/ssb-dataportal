import type { NextConfig } from 'next';
import path from 'node:path';

const isTest = process.env.NODE_ENV === 'test';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      '@': path.resolve(__dirname, 'src'),
      '@global-css': path.resolve(__dirname, 'src/app/global.css'),
    },
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.prod.json',
  },
  output: isTest ? undefined : 'standalone',
  // This is just the default cacheHandler.
  // We set it like this as a workaround for Next.js arbitrary maxiumum 2MB cache size
  // Ref: https://github.com/vercel/next.js/discussions/48324#discussioncomment-10748690
  cacheHandler: require.resolve('next/dist/server/lib/incremental-cache/file-system-cache.js'),
};

export default nextConfig;
