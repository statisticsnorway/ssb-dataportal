import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listDatasetVariables } from '@/libs/data/datasets/datasets';
import DatasetWorkspaceLoader, { preloadDatasetWorkspace } from './DatasetWorkspaceLoader';

vi.mock('server-only', () => ({}));
vi.mock('@/libs/data/datasets/datasets', () => ({ listDatasetVariables: vi.fn() }));
vi.mock('@/libs/logger/server-logger', () => ({ createLogger: () => ({ warn: vi.fn() }) }));
vi.mock('./DatasetVariableWorkspace', () => ({ default: () => null }));

const props = {
  datasetId: 'id11',
  isAuthenticated: true,
  dataFilesShared: [],
  dataFilesProduct: [],
};

describe('DatasetWorkspaceLoader', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads variables for authenticated users and passes shared file inputs through', async () => {
    const variables = [{ id: 'variable-1', short_name: 'income' }];
    vi.mocked(listDatasetVariables).mockResolvedValue(variables);
    const workspace = await DatasetWorkspaceLoader(props);

    expect(listDatasetVariables).toHaveBeenCalledWith('id11');
    expect(workspace.props).toEqual({
      datasetId: 'id11',
      dataFilesShared: props.dataFilesShared,
      dataFilesProduct: props.dataFilesProduct,
      datasetVariables: variables,
    });
  });

  it('does not fetch variables for unauthenticated users', async () => {
    preloadDatasetWorkspace(props.datasetId, false);
    const workspace = await DatasetWorkspaceLoader({ ...props, isAuthenticated: false });
    expect(listDatasetVariables).not.toHaveBeenCalled();
    expect(workspace.props.datasetVariables).toEqual([]);
  });

  it('starts loading variables when the workspace is preloaded', () => {
    vi.mocked(listDatasetVariables).mockResolvedValue([]);
    preloadDatasetWorkspace(props.datasetId, true);
    expect(listDatasetVariables).toHaveBeenCalledWith(props.datasetId);
  });

  it('preserves the empty variable fallback when fetching fails', async () => {
    vi.mocked(listDatasetVariables).mockRejectedValue(new Error('Unavailable'));
    const workspace = await DatasetWorkspaceLoader(props);
    expect(workspace.props.datasetVariables).toEqual([]);
  });
});
