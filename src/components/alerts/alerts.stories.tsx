import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { ClosableAlert } from './index';

type AlertColor = NonNullable<ComponentProps<typeof ClosableAlert>['color']>;

const alertColors = ['info', 'success', 'warning', 'danger'] satisfies readonly AlertColor[];

const meta = {
  title: 'Components/ClosableAlert',
  component: ClosableAlert,
  args: {
    heading: 'Example alert',
    message: 'This alert can be dismissed.',
  },
  argTypes: {
    color: {
      control: 'select',
      options: alertColors,
    },
  },
} satisfies Meta<typeof ClosableAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { color: 'info' } };
export const Success: Story = { args: { color: 'success' } };
export const Warning: Story = { args: { color: 'warning' } };
export const Danger: Story = { args: { color: 'danger' } };
