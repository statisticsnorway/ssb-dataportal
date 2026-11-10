import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { fn } from 'storybook/test';
import { sortTypes } from '@/types/sort';
import { SortFields } from './index';

type SortOption = ComponentProps<typeof SortFields>['sortValue'];

const sortOptions = sortTypes satisfies readonly SortOption[];

const meta = {
  title: 'Components/SortFields',
  component: SortFields,
  args: {
    sortOptions,
    sortValue: 'titleAsc',
    onSortChange: fn(),
  },
  argTypes: {
    sortValue: {
      control: 'select',
      options: sortOptions,
    },
  },
} satisfies Meta<typeof SortFields>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleAscending: Story = { args: { sortValue: 'titleAsc' } };
export const TitleDescending: Story = { args: { sortValue: 'titleDesc' } };
export const LastChanged: Story = { args: { sortValue: 'lastChanged' } };
