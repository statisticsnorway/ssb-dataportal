import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { CollapsibleCard } from './index';

type CardVariant = NonNullable<ComponentProps<typeof CollapsibleCard>['variant']>;

const cardVariants = ['card', 'flat'] satisfies readonly CardVariant[];

const meta = {
  title: 'Components/CollapsibleCard',
  component: CollapsibleCard,
  args: {
    heading: 'Filter options',
    children: 'Choose one or more options.',
    defaultOpen: true,
    variant: 'card',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: cardVariants,
    },
    defaultOpen: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof CollapsibleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardOpen: Story = { args: { variant: 'card', defaultOpen: true } };
export const CardClosed: Story = { args: { variant: 'card', defaultOpen: false } };
export const FlatOpen: Story = { args: { variant: 'flat', defaultOpen: true } };
export const FlatClosed: Story = { args: { variant: 'flat', defaultOpen: false } };
