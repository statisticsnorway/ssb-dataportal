import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassificationVersion } from '@/stories/fixtures';
import CorrespondencesView from './CorrespondencesView';

const meta = {
  title: 'Feature/Classifications/CorrespondencesView',
  component: CorrespondencesView,
  args: {
    classificationId: 2003,
    classificationVersion: mockClassificationVersion,
  },
} satisfies Meta<typeof CorrespondencesView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithCorrespondence: Story = {
  args: {
    classificationVersion: {
      ...mockClassificationVersion,
      correspondenceTables: [
        { id: 21, name: 'Industry mapping', source: 'Industry 2008', target: 'Industry 2025', changeTable: false },
      ],
    },
  },
};
