import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal';
import { mockVariable, mockVariables } from '@/stories/fixtures';
import { StoryAuthProvider } from '@/stories/providers';
import VariableDefinitionDetail from './variableDefinitionDetail';

const publicVariable = { ...mockVariable, variable_status: VariableStatus.PublishedExternal };

const meta = {
  title: 'Feature/VariableDefinitions/VariableDefinitionDetail',
  component: VariableDefinitionDetail,
  args: {
    variableDefinition: publicVariable,
    variableDefinitions: mockVariables.filter((variable) => variable.id === publicVariable.id),
    apiDocsBaseUrl: 'https://example.com/api-docs',
    daplaLabVardefUrl: 'https://example.com/lab',
  },
} satisfies Meta<typeof VariableDefinitionDetail>;

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
