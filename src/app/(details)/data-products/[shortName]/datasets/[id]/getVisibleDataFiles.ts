import type { DaplaDataFileDTO } from '@/libs/data-access/datadoc';

export function getVisibleDataFiles(
  sharedFiles: DaplaDataFileDTO[],
  productFiles: DaplaDataFileDTO[],
  isAuthenticated: boolean,
): DaplaDataFileDTO[] {
  return isAuthenticated
    ? [...sharedFiles, ...productFiles]
    : sharedFiles.filter((file) => !file.naming_standard_violations?.length);
}
