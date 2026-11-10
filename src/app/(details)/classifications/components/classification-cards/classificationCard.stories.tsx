import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Item } from '@/types/item';
import { ClassificationCard } from './index';

const content: Item[] = [
  { label: 'Code', value: '01' },
  { label: 'Level', value: '1' },
];

const meta = {
  title: 'Feature/Classifications/ClassificationCard',
  component: ClassificationCard,
  args: {
    title: 'Agriculture',
    content,
    href: '/classifications/2003',
  },
} satisfies Meta<typeof ClassificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linked: Story = {};
export const Static: Story = { args: { href: undefined } };
