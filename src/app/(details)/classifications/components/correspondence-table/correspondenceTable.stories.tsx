import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { fn } from 'storybook/test';
import { CorrespondenceTable } from './index';

type CorrespondenceProps = ComponentProps<typeof CorrespondenceTable>;

const mappings: CorrespondenceProps['mappings'] = [
  { sourceCode: '01', sourceName: 'Agriculture', targetCode: 'A', targetName: 'Primary industries' },
  { sourceCode: '02', sourceName: 'Forestry', targetCode: 'A', targetName: 'Primary industries' },
  { sourceCode: '03', sourceName: 'Fishing', targetCode: 'B', targetName: 'Marine industries' },
];

const meta = {
  title: 'Feature/Classifications/CorrespondenceTable',
  component: CorrespondenceTable,
  args: {
    sourceName: 'Source classification',
    targetName: 'Target classification',
    mappings,
    downloadHref: '/classifications/2003/download',
    onInvertedChange: fn(),
  },
  argTypes: {
    inverted: { control: 'boolean' },
    downloadFollowsStoredDirection: { control: 'boolean' },
  },
} satisfies Meta<typeof CorrespondenceTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StoredDirection: Story = {};
export const Inverted: Story = { args: { inverted: true, downloadFollowsStoredDirection: true } };
