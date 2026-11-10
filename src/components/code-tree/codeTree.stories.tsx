import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import type { KlassCode } from '@/types/klass-codes';
import { CodeTree } from './index';

const codes: KlassCode[] = [
  { code: 'A', parentCode: null, level: '1', name: 'Agriculture', validFrom: '2000-01-01' },
  { code: '01', parentCode: 'A', level: '2', name: 'Crop production', shortName: 'crops', validFrom: '2000-01-01' },
  {
    code: '011',
    parentCode: '01',
    level: '3',
    name: 'Growing of non-perennial crops',
    shortName: 'non-perennial',
    validFrom: '2000-01-01',
    notes: 'Includes annual and biennial crops.',
  },
];

const meta = {
  title: 'Components/CodeTree',
  component: CodeTree,
  args: {
    codes,
    onChange: fn(),
    autoExpandAll: false,
    showShortNames: false,
  },
  argTypes: {
    autoExpandAll: { control: 'boolean' },
    showShortNames: { control: 'boolean' },
  },
} satisfies Meta<typeof CodeTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const Expanded: Story = { args: { autoExpandAll: true } };
export const WithShortNames: Story = { args: { autoExpandAll: true, showShortNames: true } };
