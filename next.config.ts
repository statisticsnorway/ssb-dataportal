import type { NextConfig } from 'next';
import path from 'path';

const isTest = process.env.NODE_ENV === 'test';

const nextConfig: NextConfig = {
  /* config options for Turbopack here */
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
  },
  output: isTest ? undefined : 'standalone',
};

export default nextConfig;
