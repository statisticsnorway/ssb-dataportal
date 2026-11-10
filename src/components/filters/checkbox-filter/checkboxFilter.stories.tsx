import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { fn } from 'storybook/test';
import type { FilterItem } from '@/types/filters';
import { CheckboxFilter } from './index';

type CheckboxVariant = NonNullable<ComponentProps<typeof CheckboxFilter>['variant']>;

const variants = ['card', 'flat'] satisfies readonly CheckboxVariant[];
const filters: FilterItem[] = [
  { value: 'active', label: 'Active', count: 8 },
  { value: 'archived', label: 'Archived', count: 3 },
];

const meta = {
  title: 'Components/CheckboxFilter',
  component: CheckboxFilter,
  args: {
    filterHeading: 'Status',
    filters,
    selectedItems: [filters[0]!],
    onFilterChange: fn(),
    variant: 'flat',
    defaultOpen: true,
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof CheckboxFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flat: Story = { args: { variant: 'flat' } };
export const Card: Story = { args: { variant: 'card' } };
export const Closed: Story = { args: { defaultOpen: false } };
