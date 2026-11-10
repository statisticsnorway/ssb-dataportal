import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PeriodFormat } from '@/libs/data-access/datadoc';
import { mockDataFiles } from '@/stories/fixtures';
import DataCoverageTimeline from './dataCoverageTimeline';
import type { TimelineItem } from './types';
import type { TimelineData } from './useTimelineData';

const timelineItem: TimelineItem = {
  ...mockDataFiles[0]!,
  file_path: 'gs://example/arbstatus/2024-01.parquet',
  data_file_version: 1,
  periodType: PeriodFormat.YEAR_MONTH,
  start: '2024-01-01',
  end: '2024-01-31',
};

const timelineData: TimelineData = {
  isValid: true,
  periodType: PeriodFormat.YEAR_MONTH,
  allItems: [timelineItem],
  items: [timelineItem],
  years: [2024],
  slots: {
    2024: [
      { start: '2024-01-01', end: '2024-01-31', label: 'jan' },
      { start: '2024-02-01', end: '2024-02-29', label: 'feb' },
      { start: '2024-03-01', end: '2024-03-31', label: 'mar' },
    ],
  },
};

const meta = {
  title: 'Components/DataCoverageTimeline',
  component: DataCoverageTimeline,
  args: timelineData,
} satisfies Meta<typeof DataCoverageTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllPeriods: Story = {};
export const SelectedPeriod: Story = {
  args: { selectedPeriodRange: { start: '2024-01-01', end: '2024-01-31' } },
};
