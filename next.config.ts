import type { NextConfig } from 'next';
import type { RuleSetRule } from 'webpack';
import path from 'path';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config: { module: { rules: any[] }; resolve: { alias: any } }) {
    const fileLoaderRule = config.module.rules.find(
      (rule: RuleSetRule) => !!rule.test && rule.test instanceof RegExp && rule.test.test('.svg'),
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
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    // Aliases
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@global-css': path.resolve(__dirname, 'src/app/global.css'),
    };

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

export default nextConfig;
