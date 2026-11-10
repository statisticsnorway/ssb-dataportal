import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { StoryAuthProvider, StorySuspense, StoryVariableDefinitionsProvider } from '@/stories/providers';
import { ResultsSection } from './ResultsSection';

const meta = {
  title: 'Feature/VariableDefinitions/ResultsSection',
  component: ResultsSection,
  args: {
    currentPage: 1,
    pageSize: 8,
    handlePageChange: fn(),
  },
  decorators: [
    (Story) => (
      <StoryVariableDefinitionsProvider>
        <StoryAuthProvider>
          <StorySuspense>
            <Story />
          </StorySuspense>
        </StoryAuthProvider>
      </StoryVariableDefinitionsProvider>
    ),
  ],
} satisfies Meta<typeof ResultsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};
