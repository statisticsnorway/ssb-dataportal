import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listDatasetVariables } from '@/libs/data/datasets/datasets';
import { PeriodType } from '@/libs/data-access/datadoc';
import DatasetVariablesLoader, { preloadDatasetVariables } from './DatasetVariablesLoader';

vi.mock('server-only', () => ({}));
vi.mock('@/libs/data/datasets/datasets', () => ({ listDatasetVariables: vi.fn() }));
vi.mock('@/libs/logger/server-logger', () => ({ createLogger: () => ({ warn: vi.fn() }) }));
vi.mock('./DatasetVariablesWorkspace', () => ({ default: () => null }));

const props = {
  datasetId: 'id11',
  periodType: PeriodType.HALF_YEAR,
  isAuthenticated: true,
  dataFilesShared: [],
  dataFilesProduct: [],
};

describe('DatasetVariablesLoader', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads variables for authenticated users and passes shared file inputs through', async () => {
    const variables = [{ id: 'variable-1', short_name: 'income' }];
    vi.mocked(listDatasetVariables).mockResolvedValue(variables);
    const workspace = await DatasetVariablesLoader(props);

    expect(listDatasetVariables).toHaveBeenCalledWith('id11');
    expect(workspace.props).toEqual({
      datasetId: 'id11',
      periodType: PeriodType.HALF_YEAR,
      dataFilesShared: props.dataFilesShared,
      dataFilesProduct: props.dataFilesProduct,
      datasetVariables: variables,
    });
  });

  it('does not fetch variables for unauthenticated users', async () => {
    preloadDatasetVariables(props.datasetId, false);
    const workspace = await DatasetVariablesLoader({ ...props, isAuthenticated: false });
    expect(listDatasetVariables).not.toHaveBeenCalled();
    expect(workspace.props.datasetVariables).toEqual([]);
  });

  it('starts loading variables when the workspace is preloaded', () => {
    vi.mocked(listDatasetVariables).mockResolvedValue([]);
    preloadDatasetVariables(props.datasetId, true);
    expect(listDatasetVariables).toHaveBeenCalledWith(props.datasetId);
  });

  it('preserves the empty variable fallback when fetching fails', async () => {
    vi.mocked(listDatasetVariables).mockRejectedValue(new Error('Unavailable'));
    const workspace = await DatasetVariablesLoader(props);
    expect(workspace.props.datasetVariables).toEqual([]);
  });
});
