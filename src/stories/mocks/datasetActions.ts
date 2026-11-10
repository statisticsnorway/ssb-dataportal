import { mockDatasetVariables } from '@/stories/fixtures';

export async function listDatasetVariableDataFilePaths(_datasetId: string, variableIds: string[]) {
  return variableIds.length > 0 ? ['gs://example/arbstatus/2024-01.parquet'] : [];
}

export async function listDatasetVariableIdsInPeriod() {
  return mockDatasetVariables.map((variable) => variable.id);
}
