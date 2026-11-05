import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticateUser } from '@/libs/auth/userAuth';
import { listDataFilesByDatasetIdAndVariableIds } from '@/libs/data/datasets/datasets';
import type { DaplaDataFileDTO } from '@/libs/data-access/datadoc';
import { listDatasetVariableDataFilePaths, listDatasetVariableDataFilePathsByVariableIds } from './actions';

vi.mock('@/libs/auth/userAuth', () => ({ authenticateUser: vi.fn() }));
vi.mock('@/libs/data/datasets/datasets', () => ({ listDataFilesByDatasetIdAndVariableIds: vi.fn() }));

const file = (file_path: string) => ({ file_path }) as DaplaDataFileDTO;

describe('dataset variable actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: true });
  });

  it('rejects unauthenticated callers', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });

    await expect(listDatasetVariableDataFilePaths('ds', ['v1'])).rejects.toThrow('Unauthorized');
    await expect(listDatasetVariableDataFilePathsByVariableIds('ds', ['v1'])).rejects.toThrow('Unauthorized');
    expect(listDataFilesByDatasetIdAndVariableIds).not.toHaveBeenCalled();
  });

  it('returns nothing without fetching when there are no variable IDs', async () => {
    await expect(listDatasetVariableDataFilePaths('ds', ['', ''])).resolves.toEqual([]);
    expect(listDataFilesByDatasetIdAndVariableIds).not.toHaveBeenCalled();
  });

  it('de-duplicates variable IDs and file paths', async () => {
    vi.mocked(listDataFilesByDatasetIdAndVariableIds).mockResolvedValue([file('a'), file('a'), file('b')]);

    await expect(listDatasetVariableDataFilePaths('ds', ['v1', 'v1', 'v2'])).resolves.toEqual(['a', 'b']);
    expect(listDataFilesByDatasetIdAndVariableIds).toHaveBeenCalledWith('ds', ['v1', 'v2']);
  });

  it('fetches file paths per variable in batches', async () => {
    vi.mocked(listDataFilesByDatasetIdAndVariableIds).mockImplementation(async (_id, [variableId]) => [
      file(`${variableId}.parquet`),
    ]);
    const ids = Array.from({ length: 10 }, (_, index) => `v${index}`);

    const result = await listDatasetVariableDataFilePathsByVariableIds('ds', ids);

    expect(Object.keys(result)).toHaveLength(10);
    expect(result['v9']).toEqual(['v9.parquet']);
    expect(listDataFilesByDatasetIdAndVariableIds).toHaveBeenCalledTimes(10);
  });
});
