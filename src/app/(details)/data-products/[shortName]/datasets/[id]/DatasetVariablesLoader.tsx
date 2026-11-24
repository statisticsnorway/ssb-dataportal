import 'server-only';

import { cache } from 'react';
import { listDatasetVariables } from '@/libs/data/datasets/datasets';
import type { DaplaDataFileDTO, PeriodType } from '@/libs/data-access/datadoc';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import DatasetVariablesWorkspace from './DatasetVariablesWorkspace';

const getWorkspaceVariables = cache(async (datasetId: string, isAuthenticated: boolean) =>
  isAuthenticated
    ? await listDatasetVariables(datasetId).catch((error: unknown) => {
        createLogger('dataset-workspace').warn(
          { id: datasetId, error: sanitizeError(error) },
          'Failed to load dataset variables',
        );
        return [];
      })
    : [],
);

export function preloadDatasetVariables(datasetId: string, isAuthenticated: boolean) {
  void getWorkspaceVariables(datasetId, isAuthenticated);
}

export default async function DatasetVariablesLoader({
  datasetId,
  periodType,
  isAuthenticated,
  dataFilesShared,
  dataFilesProduct,
}: Readonly<{
  datasetId: string;
  periodType?: PeriodType | null;
  isAuthenticated: boolean;
  dataFilesShared: DaplaDataFileDTO[];
  dataFilesProduct: DaplaDataFileDTO[];
}>) {
  const datasetVariables = await getWorkspaceVariables(datasetId, isAuthenticated);

  return (
    <DatasetVariablesWorkspace
      datasetId={datasetId}
      periodType={periodType}
      dataFilesShared={dataFilesShared}
      dataFilesProduct={dataFilesProduct}
      datasetVariables={datasetVariables}
    />
  );
}
