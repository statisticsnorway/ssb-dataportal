import { PeriodFormat } from '@/libs/data-access/datadoc';

export type TimelineItem = {
  filePath: string;
  periodType: PeriodFormat;
  start: string;
  end: string;
};

export type Slot = {
  start: Date;
  end: Date;
  label: string;
};

export type PeriodDef = {
  count: number;
  monthsEach: number;
  label: (slotIndex: number) => string;
};
