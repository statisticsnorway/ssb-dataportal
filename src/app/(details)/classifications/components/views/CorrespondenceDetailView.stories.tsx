import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CorrespondenceTableResource } from '@/libs/data-access/klass';
import { StoryNuqsProvider } from '@/stories/providers';
import CorrespondenceDetailView from './CorrespondenceDetailView';

const table: CorrespondenceTableResource = {
  id: 21,
  name: 'Industry mapping',
  source: 'Industry 2008',
  target: 'Industry 2025',
  correspondenceMaps: [
    { sourceCode: '01', sourceName: 'Agriculture', targetCode: 'A', targetName: 'Primary industries' },
    { sourceCode: '02', sourceName: 'Forestry', targetCode: 'A', targetName: 'Primary industries' },
  ],
};

const meta = {
  title: 'Feature/Classifications/CorrespondenceDetailView',
  component: CorrespondenceDetailView,
  args: {
    table,
    backHref: '/classifications/2003/correspondences',
    downloadHref: '/classifications/2003/correspondences/21/download',
  },
  decorators: [
    (Story) => (
      <StoryNuqsProvider>
        <Story />
      </StoryNuqsProvider>
    ),
  ],
} satisfies Meta<typeof CorrespondenceDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMappings: Story = {};
