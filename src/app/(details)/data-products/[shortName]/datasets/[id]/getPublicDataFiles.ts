import type { DaplaDataFileDTO } from '@/libs/data-access/datadoc';

export function getPublicDataFiles(sharedFiles: DaplaDataFileDTO[]): DaplaDataFileDTO[] {
  return sharedFiles.filter((file) => !file.naming_standard_violations?.length);
}
