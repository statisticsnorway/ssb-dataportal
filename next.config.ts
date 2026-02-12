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
  /* config options for Webpack here */
  webpack(config: { module: { rules: any[] }; resolve: { alias: any } }) {
    const fileLoaderRule = config.module.rules.find(
      (rule: any) => !!rule.test && rule.test instanceof RegExp && rule.test.test('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@global-css': path.resolve(__dirname, 'src/app/global.css'),
    };

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: isTest ? undefined : 'standalone',
};

export default nextConfig;
