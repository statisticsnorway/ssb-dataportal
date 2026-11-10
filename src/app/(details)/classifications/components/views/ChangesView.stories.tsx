import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassification, mockClassificationVersion } from '@/stories/fixtures';
import ChangesView from './ChangesView';

const meta = {
  title: 'Feature/Classifications/ChangesView',
  component: ChangesView,
  args: {
    classification: mockClassification,
    version: mockClassificationVersion,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/classifications/2003/changes',
      },
    },
  },
} satisfies Meta<typeof ChangesView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPreviousVersion: Story = {};
export const FirstVersion: Story = {
  args: {
    classification: { ...mockClassification, versions: [mockClassification.versions?.[0]!] },
  },
};
