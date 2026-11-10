import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { StoryNuqsProvider } from '@/stories/providers';
import { CorrespondenceTableWithDirection } from './correspondence-table-with-direction';

type CorrespondenceProps = ComponentProps<typeof CorrespondenceTableWithDirection>;

const mappings: CorrespondenceProps['mappings'] = [
  { sourceCode: '01', sourceName: 'Agriculture', targetCode: 'A', targetName: 'Primary industries' },
  { sourceCode: '02', sourceName: 'Forestry', targetCode: 'A', targetName: 'Primary industries' },
];

const meta = {
  title: 'Feature/Classifications/CorrespondenceTableWithDirection',
  component: CorrespondenceTableWithDirection,
  args: {
    sourceName: 'Source classification',
    targetName: 'Target classification',
    mappings,
    downloadHref: '/classifications/2003/download',
  },
  decorators: [
    (Story) => (
      <StoryNuqsProvider>
        <Story />
      </StoryNuqsProvider>
    ),
  ],
} satisfies Meta<typeof CorrespondenceTableWithDirection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
