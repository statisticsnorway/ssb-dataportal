import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockDataFiles, mockDataset, mockDatasetVariables } from '@/stories/fixtures';
import { StoryAuthProvider } from '@/stories/providers';
import DatasetDetail from './datasetDetail';

const meta = {
  title: 'Feature/DataProducts/DatasetDetail',
  component: DatasetDetail,
  args: {
    dataset: mockDataset,
    dataFilesShared: mockDataFiles,
    dataFilesProduct: [],
    datasetVariables: mockDatasetVariables.slice(0, 4),
  },
} satisfies Meta<typeof DatasetDetail>;

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
  decorators: [
    (Story) => (
      <StoryAuthProvider isAuthenticated>
        <Story />
      </StoryAuthProvider>
    ),
  ],
};
