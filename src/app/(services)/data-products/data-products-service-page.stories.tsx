import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockDataProducts, mockSubjectFields } from '@/stories/fixtures';
import { StoryAuthProvider, StoryNuqsProvider } from '@/stories/providers';
import { DataProductsServicePage } from './data-products-service-page';

const meta = {
  title: 'Feature/DataProducts/DataProductsServicePage',
  component: DataProductsServicePage,
  args: {
    dataProducts: mockDataProducts,
    subjectFields: mockSubjectFields,
    statisticProductFilterHelp: {
      heading: 'About statistical products',
      text: 'Products that contribute to published statistics.',
    },
  },
  decorators: [
    (Story) => (
      <StoryNuqsProvider>
        <Story />
      </StoryNuqsProvider>
    ),
  ],
} satisfies Meta<typeof DataProductsServicePage>;

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
