'use server';

import { authenticateUser } from '@/libs/auth/userAuth';
import { listDataFilesByDatasetIdAndStorageCategory, listDatasetVariables } from '@/libs/data/datasets/datasets';

async function assertAuthenticated() {
  const { isAuthenticated } = await authenticateUser();
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }
}

/** File paths of the data files containing at least one of the given variables. */
export async function listDatasetVariableDataFilePaths(datasetId: string, variableIds: string[]): Promise<string[]> {
  await assertAuthenticated();

  if (variableIds.length === 0) {
    return [];
  }

  const dataFiles = await listDataFilesByDatasetIdAndStorageCategory(datasetId, undefined, variableIds);
  return [...new Set(dataFiles.map((dataFile) => dataFile.file_path))];
}

/** IDs of the dataset's variables found in data files overlapping the period. Dates are inclusive, as `YYYY-MM-DD`. */
export async function listDatasetVariableIdsInPeriod(
  datasetId: string,
  from: string,
  until: string,
): Promise<string[]> {
  await assertAuthenticated();

  const variables = await listDatasetVariables(datasetId, { from: new Date(from), until: new Date(until) });
  return variables.map((variable) => variable.id);
}
