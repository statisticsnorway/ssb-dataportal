import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmailLink } from './emailLink';

const meta = {
  title: 'Components/EmailLink',
  component: EmailLink,
  args: {
    email: 'metadata@example.com',
  },
} satisfies Meta<typeof EmailLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
