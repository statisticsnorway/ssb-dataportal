import path from 'node:path';
import type { Plugin } from 'vite';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const root = process.cwd();

const storyDataMocks: Plugin = {
  name: 'storybook-story-data-mocks',
  enforce: 'pre',
  resolveId(source, importer) {
    const sourceFile = importer?.split('?')[0]?.replaceAll('\\', '/');
    const sourcePath = source.replaceAll('\\', '/');

    if (
      sourcePath.endsWith('/datasets/[id]/actions.ts') ||
      (sourcePath === './actions' && sourceFile?.endsWith('/datasets/[id]/datasetDetail.tsx'))
    ) {
      return path.join(root, 'src/stories/mocks/datasetActions.ts');
    }

    if (
      sourcePath.endsWith('/libs/data/classifications/codesData') ||
      sourcePath.endsWith('/libs/data/classifications/codesData.ts')
    ) {
      return path.join(root, 'src/stories/mocks/classificationCodesData.ts');
    }

    if (
      sourcePath.endsWith('/libs/data/classifications/versionsData') ||
      sourcePath.endsWith('/libs/data/classifications/versionsData.ts')
    ) {
      return path.join(root, 'src/stories/mocks/classificationVersionsData.ts');
    }

    if (
      sourcePath.endsWith('/libs/data/classifications/subscriptionData') ||
      sourcePath.endsWith('/libs/data/classifications/subscriptionData.ts')
    ) {
      return path.join(root, 'src/stories/mocks/classificationSubscriptionData.ts');
    }

    return null;
  },
  load(id) {
    const modulePath = id.split('?')[0]?.replaceAll('\\', '/');

    if (modulePath?.endsWith('/libs/data/classifications/codesData.ts')) {
      return `export { fetchChanges } from '/src/stories/mocks/classificationCodesData.ts';`;
    }

    if (modulePath?.endsWith('/libs/data/classifications/versionsData.ts')) {
      return `export { fetchVersionById } from '/src/stories/mocks/classificationVersionsData.ts';`;
    }

    if (modulePath?.endsWith('/libs/data/classifications/subscriptionData.ts')) {
      return `export { postSubscriber } from '/src/stories/mocks/classificationSubscriptionData.ts';`;
    }

    return null;
  },
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/nextjs-vite',
  viteFinal: async (viteConfig) => {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(storyDataMocks);
    return viteConfig;
  },
};

export default config;
