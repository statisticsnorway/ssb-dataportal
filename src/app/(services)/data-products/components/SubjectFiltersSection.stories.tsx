import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { StoryDataProductsProvider } from '@/stories/providers';
import { SubjectFiltersSection } from './SubjectFiltersSection';

const meta = {
  title: 'Feature/DataProducts/SubjectFiltersSection',
  component: SubjectFiltersSection,
  args: {
    onFilterChange: fn(),
  },
  decorators: [
    (Story) => (
      <StoryDataProductsProvider>
        <Story />
      </StoryDataProductsProvider>
    ),
  ],
} satisfies Meta<typeof SubjectFiltersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
