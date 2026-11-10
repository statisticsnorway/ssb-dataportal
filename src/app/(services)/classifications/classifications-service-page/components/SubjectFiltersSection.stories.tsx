import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { StoryClassificationProvider, StorySuspense } from '@/stories/providers';
import { SubjectFiltersSection } from './SubjectFiltersSection';

const meta = {
  title: 'Feature/Classifications/SubjectFiltersSection',
  component: SubjectFiltersSection,
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
} satisfies Meta<typeof SubjectFiltersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
