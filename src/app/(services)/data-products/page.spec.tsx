import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSubjectFieldFilterValues } from '@/libs/data/classifications/codesData';
import { listDataProducts } from '@/libs/data/datasets/datasets';
import type { DataProductDTO } from '@/libs/data-access/datadoc/models';
import type { FilterHelpText } from '@/types/filters';
import { KlassCode } from '@/types/klass-codes';
import DataProductsPage from './page';

vi.mock('server-only', () => ({}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
  }),
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue('nb'),
  }),
}));

vi.mock('@/libs/auth/userAuth', () => ({
  authenticateUser: vi.fn().mockResolvedValue({
    isAuthenticated: true,
  }),
}));

vi.mock('@/libs/language/src/getRequestLanguage', () => ({
  getRequestLanguage: vi.fn().mockResolvedValue('nb'),
}));

vi.mock('@/libs/data/classifications/codesData', () => ({
  fetchSubjectFieldFilterValues: vi.fn(),
}));

vi.mock('@/libs/data/datasets/datasets', () => ({
  listDataProducts: vi.fn(),
}));

vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => ({ info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}));

vi.mock('./data-products-service-page', () => ({
  DataProductsServicePage: ({
    dataProducts,
    subjectFields,
    statisticProductFilterHelp,
  }: {
    dataProducts: DataProductDTO[];
    subjectFields: KlassCode[];
    statisticProductFilterHelp?: FilterHelpText;
  }) => (
    <div>
      {dataProducts.length} data products and {subjectFields.length} subject fields
      {statisticProductFilterHelp && <span>{statisticProductFilterHelp.heading}</span>}
    </div>
  ),
}));

const searchParams = Promise.resolve({});

describe('DataProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('passes data products and subject fields to the service page', async () => {
    vi.mocked(listDataProducts).mockResolvedValue([
      { product_short_name: 'arbstatus', contains_valid_datasets: false },
    ]);
    vi.mocked(fetchSubjectFieldFilterValues).mockResolvedValue([
      {
        code: 'al',
        parentCode: null,
        level: '1',
        name: 'Arbeid og lønn',
        validFrom: '',
      },
    ]);
    render(await DataProductsPage({ searchParams }));
    expect(screen.getByText(/1 data products and 1 subject fields/)).toBeInTheDocument();
  });

  it('passes example filter help text when the feature flag is enabled', async () => {
    vi.stubEnv('DATA_PRODUCT_FILTER_HELP_ENABLED', 'true');
    vi.mocked(listDataProducts).mockResolvedValue([]);
    vi.mocked(fetchSubjectFieldFilterValues).mockResolvedValue([]);

    render(await DataProductsPage({ searchParams }));

    expect(screen.getByText('Hva er et statistikkprodukt?')).toBeInTheDocument();
  });

  it('does not pass filter help text when the feature flag is disabled', async () => {
    vi.stubEnv('DATA_PRODUCT_FILTER_HELP_ENABLED', 'false');
    vi.mocked(listDataProducts).mockResolvedValue([]);
    vi.mocked(fetchSubjectFieldFilterValues).mockResolvedValue([]);

    render(await DataProductsPage({ searchParams }));

    expect(screen.queryByText('Hva er et statistikkprodukt?')).not.toBeInTheDocument();
  });
});
