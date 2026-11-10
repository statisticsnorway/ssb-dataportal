import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { KlassSearchSection } from './KlassSearchSection';

const meta = {
  title: 'Feature/Classifications/KlassSearchSection',
  component: KlassSearchSection,
  args: {
    query: '',
    onQueryChange: fn(),
  },
} satisfies Meta<typeof KlassSearchSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithQuery: Story = { args: { query: 'employment' } };
