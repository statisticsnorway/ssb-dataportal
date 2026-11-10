import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { CodeSearch } from './index';

const meta = {
  title: 'Feature/Classifications/CodeSearch',
  component: CodeSearch,
  args: {
    searchId: 'code-search',
    filterTerm: '',
    setFilterTerm: fn(),
  },
} satisfies Meta<typeof CodeSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithTerm: Story = { args: { filterTerm: 'agriculture' } };
