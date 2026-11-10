import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { StoryClassificationProvider, StorySuspense } from '@/stories/providers';
import { ClassificationTypeFiltersSection } from './ClassificationTypeFiltersSection';

const meta = {
  title: 'Feature/Classifications/ClassificationTypeFiltersSection',
  component: ClassificationTypeFiltersSection,
  args: {
    onFilterChange: fn(),
  },
  decorators: [
    (Story) => (
      <StoryClassificationProvider>
        <StorySuspense>
          <Story />
        </StorySuspense>
      </StoryClassificationProvider>
    ),
  ],
} satisfies Meta<typeof ClassificationTypeFiltersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
