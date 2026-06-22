import { DaplaDataFileDTO } from '@/libs/data-access/datadoc';

export type DataFileSearchHitData = DaplaDataFileDTO & {
  contains_data_from?: Date | string | null;
  contains_data_until?: Date | string | null;
  start?: string;
  end?: string;
};
