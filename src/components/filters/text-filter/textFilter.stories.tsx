import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { fn } from 'storybook/test';
import { TextFilter } from './index';

type FilterVariant = NonNullable<ComponentProps<typeof TextFilter>['variant']>;

const variants = ['card', 'flat'] satisfies readonly FilterVariant[];

const meta = {
  title: 'Components/TextFilter',
  component: TextFilter,
  args: {
    label: 'Search variables',
    searchTerm: '',
    setSearchTerm: fn(),
    variant: 'flat',
    defaultOpen: true,
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof TextFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithSearchTerm: Story = { args: { searchTerm: 'employment' } };
export const CardClosed: Story = { args: { variant: 'card', defaultOpen: false } };
