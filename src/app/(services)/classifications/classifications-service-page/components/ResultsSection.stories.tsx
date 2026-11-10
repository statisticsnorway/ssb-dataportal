import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { StoryClassificationProvider, StorySuspense } from '@/stories/providers';
import { ResultsSection } from './ResultsSection';

const meta = {
  title: 'Feature/Classifications/ResultsSection',
  component: ResultsSection,
  args: {
    currentPage: 1,
    pageSize: 8,
    onPageChange: fn(),
    language: 'nb',
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
} satisfies Meta<typeof ResultsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};
