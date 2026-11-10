import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { CollapsibleCard } from '@/components/filters/collapsible-card';
import { TextFilter } from '@/components/filters/text-filter';
import { localization } from '@/libs/language';
import { mockDatasetWorkspaceContent } from '@/stories/datasetWorkspaceFixture';
import { DatasetWorkspace } from './DatasetWorkspace';

const meta = {
  title: 'Feature/DataProducts/DatasetWorkspace',
  component: DatasetWorkspace,
  args: {
    ...mockDatasetWorkspaceContent,
    search: <TextFilter label={localization.search.textFilter.label} searchTerm='' setSearchTerm={fn()} />,
    period: (
      <CollapsibleCard heading={localization.datasetDetail.period} variant='flat' defaultOpen={false}>
        2024
      </CollapsibleCard>
    ),
    activeFilters: null,
  },
} satisfies Meta<typeof DatasetWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithFilters: Story = {};
export const TimelineOnly: Story = { args: { showFilters: false } };
