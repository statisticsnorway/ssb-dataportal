import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAllClassifications } from '@/libs/data/classifications/classificationData';
import { fetchSubjectFieldFilterValues } from '@/libs/data/classifications/codesData';
import { fetchSearchResult } from '@/libs/data/classifications/searchData';
import { ClassificationType } from '@/types/classification';
import Classifications from './page';

vi.mock('server-only', () => ({}));

vi.mock('@/libs/language/src/getRequestLanguage', () => ({
  getRequestLanguage: vi.fn().mockResolvedValue('nb'),
}));

vi.mock('@/libs/data/classifications/classificationData', () => ({
  fetchAllClassifications: vi.fn(),
}));

vi.mock('@/libs/data/classifications/codesData', () => ({
  fetchSubjectFieldFilterValues: vi.fn(),
}));

vi.mock('@/libs/data/classifications/searchData', () => ({
  fetchSearchResult: vi.fn(),
}));

vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('./classifications-service-page', () => ({
  default: () => null,
}));

describe('Classifications page search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchAllClassifications).mockResolvedValue([]);
    vi.mocked(fetchSubjectFieldFilterValues).mockResolvedValue([]);
    vi.mocked(fetchSearchResult).mockResolvedValue([]);
  });
  it.each([
    {
      description: 'no classification type is specified',
      types: undefined,
      expectedIncludeCodelists: false,
    },
    {
      description: 'only Classification is selected',
      types: ClassificationType.Classification,
      expectedIncludeCodelists: false,
    },
    {
      description: 'only Codelist is selected',
      types: ClassificationType.Codelist,
      expectedIncludeCodelists: true,
    },
    {
      description: 'Classification and Codelist are selected',
      types: `${ClassificationType.Classification},${ClassificationType.Codelist}`,
      expectedIncludeCodelists: true,
    },
  ])('sets includeCodelists correctly when $description', async ({ types, expectedIncludeCodelists }) => {
    await Classifications({
      searchParams: Promise.resolve({
        q: 'kommune',
        types,
      }),
    });
    expect(fetchSearchResult).toHaveBeenCalledTimes(1);
    expect(fetchSearchResult).toHaveBeenCalledWith({
      query: 'kommune',
      includeCodelists: expectedIncludeCodelists,
    });
  });
});
