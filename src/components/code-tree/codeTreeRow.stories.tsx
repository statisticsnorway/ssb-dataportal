import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import type { CodeTreeNode } from '@/types/klass-codes';
import { CodeTreeRow } from './CodeTreeRow';

const node: CodeTreeNode = {
  code: {
    code: '01',
    parentCode: 'A',
    level: '2',
    name: 'Crop production',
    shortName: 'crops',
    validFrom: '2000-01-01',
    notes: 'Includes annual and biennial crops.',
  },
  children: [],
};

const meta = {
  title: 'Components/CodeTreeRow',
  component: CodeTreeRow,
  args: {
    node,
    depth: 1,
    isExpanded: false,
    isSelected: false,
    showShortNames: false,
    onToggle: fn(),
    onChange: fn(),
    onNotes: fn(),
  },
  argTypes: {
    isExpanded: { control: 'boolean' },
    isSelected: { control: 'boolean' },
    showShortNames: { control: 'boolean' },
  },
} satisfies Meta<typeof CodeTreeRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { isSelected: true } };
export const WithShortName: Story = { args: { showShortNames: true } };
