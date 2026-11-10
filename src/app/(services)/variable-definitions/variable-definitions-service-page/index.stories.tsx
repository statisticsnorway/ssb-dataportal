import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockSubjectFieldsPromise, mockVariableDefinitionsPromise } from '@/stories/fixtures';
import { StoryAuthProvider, StoryNuqsProvider } from '@/stories/providers';
import VariableDefinitionsServicePage from './index';

const meta = {
  title: 'Feature/VariableDefinitions/VariableDefinitionsServicePage',
  component: VariableDefinitionsServicePage,
  args: {
    variablesPromise: mockVariableDefinitionsPromise,
    subjectFieldsPromise: mockSubjectFieldsPromise,
  },
  decorators: [
    (Story) => (
      <StoryNuqsProvider>
        <Story />
      </StoryNuqsProvider>
    ),
  ],
} satisfies Meta<typeof VariableDefinitionsServicePage>;

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
