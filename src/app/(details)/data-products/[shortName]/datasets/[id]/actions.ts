'use server';

import { authenticateUser } from '@/libs/auth/userAuth';
import { listDataFilesByDatasetIdAndVariableIds } from '@/libs/data/datasets/datasets';

const variableFilePathBatchSize = 8;

async function getAuthenticatedVariableIds(datasetId: string, variableIds: string[]): Promise<string[]> {
  if (
    typeof datasetId !== 'string' ||
    datasetId.length === 0 ||
    !Array.isArray(variableIds) ||
    variableIds.length === 0
  ) {
    return [];
  }

  const { isAuthenticated } = await authenticateUser();
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }

  const uniqueVariableIds = [...new Set(variableIds.filter((id) => typeof id === 'string' && id.length > 0))];
  if (uniqueVariableIds.length === 0) {
    return [];
  }

  return uniqueVariableIds;
}

export async function listDatasetVariableDataFilePaths(datasetId: string, variableIds: string[]): Promise<string[]> {
  const uniqueVariableIds = await getAuthenticatedVariableIds(datasetId, variableIds);
  if (uniqueVariableIds.length === 0) {
    return [];
  }

  const dataFiles = await listDataFilesByDatasetIdAndVariableIds(datasetId, uniqueVariableIds);
  return [...new Set(dataFiles.map((dataFile) => dataFile.file_path))];
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
      batch.map(async (variableId) => {
        const dataFiles = await listDataFilesByDatasetIdAndVariableIds(datasetId, [variableId]);
        return {
          variableId,
          filePaths: [...new Set(dataFiles.map((dataFile) => dataFile.file_path))],
        };
      }),
    );

    for (const { variableId, filePaths } of batchFilePaths) {
      filePathsByVariableId[variableId] = filePaths;
    }
  }

  return filePathsByVariableId;
}
