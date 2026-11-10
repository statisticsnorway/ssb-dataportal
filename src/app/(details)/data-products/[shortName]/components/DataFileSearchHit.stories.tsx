import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockDataFileSearchHit } from '@/stories/fixtures';
import { DataFileSearchHit } from './DataFileSearchHit';

const meta = {
  title: 'Feature/DataProducts/DataFileSearchHit',
  component: DataFileSearchHit,
  args: {
    dataFile: mockDataFileSearchHit,
  },
} satisfies Meta<typeof DataFileSearchHit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithViolations: Story = {
  args: {
    dataFile: {
      ...mockDataFileSearchHit,
      naming_standard_violations: ['Missing period', 'Unexpected directory'],
    },
  },
};
