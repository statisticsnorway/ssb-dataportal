import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SubscribeDialog } from './index';

const meta = {
  title: 'Feature/Classifications/SubscribeDialog',
  component: SubscribeDialog,
  args: {
    classificationId: 2003,
  },
} satisfies Meta<typeof SubscribeDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithClassification: Story = {};
export const WithoutClassificationId: Story = { args: { classificationId: undefined } };
