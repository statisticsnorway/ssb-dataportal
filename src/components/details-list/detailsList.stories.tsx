import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { type Item, Visibility } from '@/types/item';
import { DetailsList } from './index';

type DetailsListProps = ComponentProps<typeof DetailsList>;

const content: Item[] = [
  { label: 'Identifier', value: 'EMPLOYMENT_STATUS' },
  {
    label: 'Public definition',
    value: 'A person’s relationship to the labour market.',
    visibility: new Set([Visibility.EXTERNAL]),
  },
  { label: 'Internal owner', value: 'Statistics Norway', visibility: new Set([Visibility.INTERNAL]) },
  { label: 'Source', value: 'Variable registry', popover: true },
];

const meta = {
  title: 'Components/DetailsList',
  component: DetailsList,
  args: {
    title: 'About the variable',
    popoverContent: 'Additional information about the source.',
    content,
  },
  argTypes: {
    allowedVisibility: {
      control: 'select',
      options: [Visibility.INTERNAL, Visibility.EXTERNAL],
    },
    content: {
      control: false,
    },
  },
} satisfies Meta<typeof DetailsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVisibility: Story = { args: { allowedVisibility: undefined } satisfies Partial<DetailsListProps> };
export const Internal: Story = { args: { allowedVisibility: Visibility.INTERNAL } };
export const External: Story = { args: { allowedVisibility: Visibility.EXTERNAL } };
