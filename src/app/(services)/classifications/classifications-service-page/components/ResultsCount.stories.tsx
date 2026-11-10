import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StoryClassificationProvider, StorySuspense } from '@/stories/providers';
import { ResultsCount } from './ResultsCount';

const meta = {
  title: 'Feature/Classifications/ResultsCount',
  component: ResultsCount,
  args: {
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
} satisfies Meta<typeof ResultsCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {};
