import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import type { VersionItem } from '@/types/item';
import { ClassificationTable } from './index';

const content: VersionItem[][] = [
  [
    { label: 'Code', value: '01' },
    { label: 'Name', value: 'Agriculture' },
    { label: 'Changed', value: new Date('2025-01-01') },
  ],
  [
    { label: 'Code', value: '02' },
    { label: 'Name', value: 'Forestry' },
    { label: 'Changed', value: new Date('2024-06-01') },
  ],
];

const meta = {
  title: 'Components/ClassificationTable',
  component: ClassificationTable,
  args: {
    content,
    sortableField: 'Changed',
    onlyInNorwegian: false,
  },
  argTypes: {
    onlyInNorwegian: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ClassificationTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sortable: Story = {};
export const NorwegianOnly: Story = { args: { onlyInNorwegian: true } };
export const Unsortable: Story = {
  args: { sortableField: undefined } satisfies Partial<ComponentProps<typeof ClassificationTable>>,
};
