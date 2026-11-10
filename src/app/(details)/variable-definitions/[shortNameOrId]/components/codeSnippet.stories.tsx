import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CodeSnippet } from './codeSnippet';

const meta = {
  title: 'Feature/VariableDefinitions/CodeSnippet',
  component: CodeSnippet,
  args: {
    code: ['Variable.get_by_short_name(', '    short_name="employment_status"', ')'],
    daplaLabVardefUrl: 'https://example.com/lab',
  },
} satisfies Meta<typeof CodeSnippet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabLink: Story = {};
export const WithoutLabLink: Story = { args: { daplaLabVardefUrl: undefined } };
