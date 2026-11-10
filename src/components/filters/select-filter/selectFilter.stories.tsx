import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { SelectFilter } from './index';

const filters = [
  { value: 'published', label: 'Published', count: 8 },
  { value: 'draft', label: 'Draft', count: 3 },
];

const meta = {
  title: 'Components/SelectFilter',
  component: SelectFilter,
  args: {
    filterHeading: 'Status',
    filters,
    selectedValue: '',
    defaultOptionLabel: 'All statuses',
    onFilterChange: fn(),
  },
} satisfies Meta<typeof SelectFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoSelection: Story = {};
export const Published: Story = { args: { selectedValue: 'published' } };
