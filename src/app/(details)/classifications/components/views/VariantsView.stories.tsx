import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassificationVersion } from '@/stories/fixtures';
import VariantsView from './VariantsView';

const meta = {
  title: 'Feature/Classifications/VariantsView',
  component: VariantsView,
  args: {
    classificationVersion: mockClassificationVersion,
    classificationId: 2003,
    versionId: 1,
  },
} satisfies Meta<typeof VariantsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithVariants: Story = {};
export const Empty: Story = {
  args: { classificationVersion: { ...mockClassificationVersion, classificationVariants: [] } },
};
