import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassification } from '@/stories/fixtures';
import { VersionPicker } from './index';

const meta = {
  title: 'Feature/Classifications/VersionPicker',
  component: VersionPicker,
  args: {
    classification: mockClassification,
    tab: 'codes',
  },
} satisfies Meta<typeof VersionPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleVersions: Story = {};
export const SingleVersion: Story = {
  args: { classification: { ...mockClassification, versions: mockClassification.versions?.slice(0, 1) } },
};
