import 'server-only';

import { listDatasetVariables } from '@/libs/data/datasets/datasets';
import type { DaplaDataFileDTO } from '@/libs/data-access/datadoc';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import DatasetVariableWorkspace from './DatasetVariableWorkspace';

export default async function DatasetWorkspaceLoader({
  datasetId,
  isAuthenticated,
  dataFilesShared,
  dataFilesProduct,
}: Readonly<{
  datasetId: string;
  isAuthenticated: boolean;
  dataFilesShared: DaplaDataFileDTO[];
  dataFilesProduct: DaplaDataFileDTO[];
}>) {
  const datasetVariables = isAuthenticated
    ? await listDatasetVariables(datasetId).catch((error: unknown) => {
        createLogger('dataset-workspace').warn(
          { id: datasetId, error: sanitizeError(error) },
          'Failed to load dataset variables',
        );
        return [];
      })
    : [];

  return (
    <DatasetVariableWorkspace
      datasetId={datasetId}
      dataFilesShared={dataFilesShared}
      dataFilesProduct={dataFilesProduct}
      datasetVariables={datasetVariables}
    />
  );
}
