import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticateUser } from '@/libs/auth/userAuth';
import { listDataFilesByDatasetIdAndStorageCategory, listDatasetVariables } from '@/libs/data/datasets/datasets';
import type { DaplaDataFileDTO, DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { listDatasetVariableDataFilePaths, listDatasetVariableIdsInPeriod } from './actions';

vi.mock('@/libs/auth/userAuth', () => ({ authenticateUser: vi.fn() }));
vi.mock('@/libs/data/datasets/datasets', () => ({
  listDataFilesByDatasetIdAndStorageCategory: vi.fn(),
  listDatasetVariables: vi.fn(),
}));

const file = (file_path: string) => ({ file_path }) as DaplaDataFileDTO;

describe('dataset variable actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: true });
  });

  it('rejects unauthenticated callers', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });

    await expect(listDatasetVariableDataFilePaths('ds', ['v1'])).rejects.toThrow('Unauthorized');
    await expect(listDatasetVariableIdsInPeriod('ds', '2020-01-01', '2020-01-31')).rejects.toThrow('Unauthorized');
    expect(listDataFilesByDatasetIdAndStorageCategory).not.toHaveBeenCalled();
    expect(listDatasetVariables).not.toHaveBeenCalled();
  });

  it('returns nothing without fetching when there are no variable IDs', async () => {
    await expect(listDatasetVariableDataFilePaths('ds', ['', ''])).resolves.toEqual([]);
    expect(listDataFilesByDatasetIdAndStorageCategory).not.toHaveBeenCalled();
  });

  it('de-duplicates variable IDs and file paths', async () => {
    vi.mocked(listDataFilesByDatasetIdAndStorageCategory).mockResolvedValue([file('a'), file('a'), file('b')]);

    await expect(listDatasetVariableDataFilePaths('ds', ['v1', 'v1', 'v2'])).resolves.toEqual(['a', 'b']);
    expect(listDataFilesByDatasetIdAndStorageCategory).toHaveBeenCalledWith('ds', undefined, ['v1', 'v2']);
  });

  it('lists the IDs of variables in the period', async () => {
    vi.mocked(listDatasetVariables).mockResolvedValue([{ id: 'v1' }, { id: 'v2' }] as DatasetVariableDTO[]);

    await expect(listDatasetVariableIdsInPeriod('ds', '2020-01-01', '2020-01-31')).resolves.toEqual(['v1', 'v2']);
    expect(listDatasetVariables).toHaveBeenCalledWith('ds', {
      from: new Date('2020-01-01'),
      until: new Date('2020-01-31'),
    });
  });
});
