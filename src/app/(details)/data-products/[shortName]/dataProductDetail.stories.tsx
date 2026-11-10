import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockDataProduct, mockDatasets } from '@/stories/fixtures';
import { StoryAuthProvider, StoryNuqsProvider } from '@/stories/providers';
import DataProductDetail from './dataProductDetail';

const meta = {
  title: 'Feature/DataProducts/DataProductDetail',
  component: DataProductDetail,
  args: {
    dataProduct: mockDataProduct,
    datasetsShared: mockDatasets.slice(0, 3),
    datasetsProduct: mockDatasets.slice(3, 5),
    namingStandardViolationsByDatasetId: {},
  },
  decorators: [
    (Story) => (
      <StoryNuqsProvider>
        <Story />
      </StoryNuqsProvider>
    ),
  ],
} satisfies Meta<typeof DataProductDetail>;

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
