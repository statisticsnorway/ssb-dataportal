import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DataportalBreadcrumbs } from './index';

const meta = {
  title: 'Components/DataportalBreadcrumbs',
  component: DataportalBreadcrumbs,
  args: {
    items: [
      { href: '/', text: 'Home' },
      { href: '/classifications', text: 'Classifications' },
    ],
  },
} satisfies Meta<typeof DataportalBreadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutCurrentPage: Story = {};
export const WithCurrentPage: Story = { args: { currentText: 'Employment status' } };
