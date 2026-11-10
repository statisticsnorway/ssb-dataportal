import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassificationVersion } from '@/stories/fixtures';
import { CodesView } from './CodesView';

const meta = {
  title: 'Feature/Classifications/CodesView',
  component: CodesView,
  args: {
    version: mockClassificationVersion,
    classificationId: 2003,
    isVariantDownload: false,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/classifications/2003/codes',
      },
    },
  },
} satisfies Meta<typeof CodesView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClassificationCodes: Story = {};
export const VariantCodes: Story = { args: { isVariantDownload: true } };
