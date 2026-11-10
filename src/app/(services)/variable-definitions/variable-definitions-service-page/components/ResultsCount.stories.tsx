import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StoryAuthProvider, StorySuspense, StoryVariableDefinitionsProvider } from '@/stories/providers';
import { ResultsCount } from './ResultsCount';

const meta = {
  title: 'Feature/VariableDefinitions/ResultsCount',
  component: ResultsCount,
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
} satisfies Meta<typeof ResultsCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {};
