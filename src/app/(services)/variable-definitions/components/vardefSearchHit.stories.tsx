import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockVariable } from '@/stories/fixtures';
import { StoryAuthProvider, StorySuspense, StoryVariableDefinitionsProvider } from '@/stories/providers';
import { VardefSearchHit } from './vardefSearchHit';

const meta = {
  title: 'Feature/VariableDefinitions/VardefSearchHit',
  component: VardefSearchHit,
  args: {
    variableDefinition: mockVariable,
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
} satisfies Meta<typeof VardefSearchHit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Public: Story = {};
export const Authenticated: Story = {
  decorators: [
    (Story) => (
      <StoryVariableDefinitionsProvider>
        <StoryAuthProvider isAuthenticated>
          <StorySuspense>
            <Story />
          </StorySuspense>
        </StoryAuthProvider>
      </StoryVariableDefinitionsProvider>
    ),
  ],
};
