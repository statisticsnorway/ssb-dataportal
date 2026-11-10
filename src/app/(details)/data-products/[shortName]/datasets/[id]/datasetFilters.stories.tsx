import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { mockDatasetWorkspaceContent } from '@/stories/datasetWorkspaceFixture';
import { DatasetFilters, type TimelinePeriodSlot } from './datasetFilters';

const timelinePeriods: TimelinePeriodSlot[] = [
  { start: '2024-01-01', end: '2024-01-31', label: 'jan', year: 2024 },
  { start: '2024-02-01', end: '2024-02-29', label: 'feb', year: 2024 },
  { start: '2024-03-01', end: '2024-03-31', label: 'mar', year: 2024 },
];

const meta = {
  title: 'Feature/DataProducts/DatasetFilters',
  component: DatasetFilters,
  args: {
    filters: { search: '', period: null },
    timelinePeriods,
    onChange: fn(),
    content: mockDatasetWorkspaceContent,
  },
} satisfies Meta<typeof DatasetFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoFilters: Story = {};
export const SearchAndPeriod: Story = {
  args: { filters: { search: 'employment', period: [0, 1] } },
};
export const NoTimeline: Story = {
  args: {
    timelinePeriods: [],
    content: { ...mockDatasetWorkspaceContent, timeline: null },
  },
};
