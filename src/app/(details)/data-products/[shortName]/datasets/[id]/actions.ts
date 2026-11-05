'use server';

import { authenticateUser } from '@/libs/auth/userAuth';
import { listDataFilesByDatasetIdAndVariableIds } from '@/libs/data/datasets/datasets';
import type { DaplaDataFileDTO } from '@/libs/data-access/datadoc';

const variableFilePathBatchSize = 8;

const uniqueFilePaths = (dataFiles: DaplaDataFileDTO[]) => [
  ...new Set(dataFiles.map((dataFile) => dataFile.file_path)),
];

async function getAuthenticatedVariableIds(datasetId: string, variableIds: string[]): Promise<string[]> {
  const { isAuthenticated } = await authenticateUser();
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }

  if (!datasetId) {
    return [];
  }

  return [...new Set(variableIds.filter(Boolean))];
}

export async function listDatasetVariableDataFilePaths(datasetId: string, variableIds: string[]): Promise<string[]> {
  const uniqueVariableIds = await getAuthenticatedVariableIds(datasetId, variableIds);
  if (uniqueVariableIds.length === 0) {
    return [];
  }

  return uniqueFilePaths(await listDataFilesByDatasetIdAndVariableIds(datasetId, uniqueVariableIds));
}

export async function listDatasetVariableDataFilePathsByVariableIds(
  datasetId: string,
  variableIds: string[],
): Promise<Record<string, string[]>> {
  const uniqueVariableIds = await getAuthenticatedVariableIds(datasetId, variableIds);
  const filePathsByVariableId: Record<string, string[]> = {};

  for (let index = 0; index < uniqueVariableIds.length; index += variableFilePathBatchSize) {
    const batch = uniqueVariableIds.slice(index, index + variableFilePathBatchSize);
    const batchFilePaths = await Promise.all(
      batch.map(async (variableId) => ({
        variableId,
        filePaths: uniqueFilePaths(await listDataFilesByDatasetIdAndVariableIds(datasetId, [variableId])),
      })),
    );

    for (const { variableId, filePaths } of batchFilePaths) {
      filePathsByVariableId[variableId] = filePaths;
    }
  }

  return filePathsByVariableId;
}
