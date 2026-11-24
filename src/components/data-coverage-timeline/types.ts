import { type DataFileSearchHitData } from '@/types/dataFileSearchHit';

export type TimelineItem = Omit<DataFileSearchHitData, 'file_path' | 'data_file_version' | 'start' | 'end'> & {
  file_path: string;
  data_file_version: number;
  start: string;
  end: string;
};

export type Slot = {
  start: string;
  end: string;
  label: string;
};

export type PeriodDef = {
  count: number;
  label: (slotIndex: number) => string;
};
