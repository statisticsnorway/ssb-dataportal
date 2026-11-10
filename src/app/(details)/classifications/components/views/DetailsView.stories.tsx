import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassification, mockClassificationVersion } from '@/stories/fixtures';
import DetailsView from './DetailsView';

const meta = {
  title: 'Feature/Classifications/DetailsView',
  component: DetailsView,
  args: {
    classification: mockClassification,
    classificationVersion: mockClassificationVersion,
  },
} satisfies Meta<typeof DetailsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
