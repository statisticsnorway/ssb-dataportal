import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { fn } from 'storybook/test';
import type { FilterItem } from '@/types/filters';
import { NestedCheckboxFilter } from './index';

const filters: FilterItem[] = [
  { value: 'labour', label: 'Labour market' },
  { value: 'education', label: 'Education' },
];

const meta = {
  title: 'Components/NestedCheckboxFilter',
  component: NestedCheckboxFilter,
  args: {
    filterHeading: 'Subject areas',
    filters,
    selectedItems: [filters[0]!],
    onFilterChange: fn(),
    visuallyHideHeading: false,
  },
  argTypes: {
    visuallyHideHeading: { control: 'boolean' },
  },
} satisfies Meta<typeof NestedCheckboxFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VisibleHeading: Story = { args: { visuallyHideHeading: false } };
export const ScreenReaderHeading: Story = {
  args: { visuallyHideHeading: true } satisfies Partial<ComponentProps<typeof NestedCheckboxFilter>>,
};
