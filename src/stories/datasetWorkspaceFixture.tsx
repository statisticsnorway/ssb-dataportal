import DatasetVariableList from '@/app/(details)/data-products/[shortName]/datasets/[id]/DatasetVariableList';
import type { DatasetWorkspaceContent } from '@/app/(details)/data-products/[shortName]/datasets/[id]/DatasetWorkspace';
import DataCoverageTimeline from '@/components/data-coverage-timeline/dataCoverageTimeline';
import type { TimelineItem } from '@/components/data-coverage-timeline/types';
import type { TimelineData } from '@/components/data-coverage-timeline/useTimelineData';
import { PeriodFormat } from '@/libs/data-access/datadoc';
import { mockDataFiles, mockDatasetVariables } from '@/stories/fixtures';

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

export const mockDatasetWorkspaceContent: DatasetWorkspaceContent = {
  timeline: <DataCoverageTimeline {...timelineData} />,
  variables: <DatasetVariableList variables={mockDatasetVariables.slice(0, 4)} />,
  showFilters: true,
};
