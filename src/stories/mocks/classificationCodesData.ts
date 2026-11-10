import type { FetchChangesResult } from '@/libs/data/classifications/codesData';

export async function fetchChanges(): Promise<FetchChangesResult> {
  return {
    status: 'success',
    changes: [],
  };
}
