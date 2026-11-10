import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockDataset } from '@/stories/fixtures';
import { StoryAuthProvider } from '@/stories/providers';
import { DatasetSearchHit } from './DatasetSearchHit';

const meta = {
  title: 'Feature/DataProducts/DatasetSearchHit',
  component: DatasetSearchHit,
  args: {
    dataset: mockDataset,
    namingStandardViolationsCount: 0,
  },
} satisfies Meta<typeof DatasetSearchHit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Public: Story = {
  decorators: [
    (Story) => (
      <StoryAuthProvider>
        <Story />
      </StoryAuthProvider>
    ),
  ],
};
export const Authenticated: Story = {
  args: { namingStandardViolationsCount: 3 },
  decorators: [
    (Story) => (
      <StoryAuthProvider isAuthenticated>
        <Story />
      </StoryAuthProvider>
    ),
  ],
};
