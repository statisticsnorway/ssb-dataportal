import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listDataProducts, listDatasets } from '@/libs/data/datasets/datasets';
import { type DataProductDTO, type DatasetDTO } from '@/libs/data-access/datadoc/models';
import type { CodeItem } from '@/libs/data-access/klass/models';
import DataProductsPage from './page';

vi.mock('@/libs/data/datasets/datasets', () => ({
  listDataProducts: vi.fn(),
  listDatasets: vi.fn(),
}));

vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => ({ info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}));

vi.mock('./data-products-service-page', () => ({
  DataProductsServicePage: ({
    dataProducts,
    datasets,
    subjectFields,
  }: {
    dataProducts: DataProductDTO[];
    datasets: DatasetDTO[];
    subjectFields: CodeItem[];
  }) => (
    <div>
      {dataProducts.length} data products, {datasets.length} datasets and {subjectFields.length} subject fields
    </div>
  ),
}));

const searchParams = Promise.resolve({});

describe('DataProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes data products and datasets to the service page', async () => {
    vi.mocked(listDataProducts).mockResolvedValue([{ product_short_name: 'arbstatus' }]);
    vi.mocked(listDatasets).mockResolvedValue([{ id: 'ds-1', product_short_name: 'arbstatus' }]);
    render(await DataProductsPage({ searchParams }));
    expect(screen.getByText(/1 data products, 1 datasets and \d+ subject fields/)).toBeInTheDocument();
  });

  it('renders data products without assessment filters when dataset loading fails', async () => {
    vi.mocked(listDataProducts).mockResolvedValue([{ product_short_name: 'arbstatus' }]);
    vi.mocked(listDatasets).mockRejectedValue(new Error('Could not load datasets'));
    render(await DataProductsPage({ searchParams }));
    expect(screen.getByText(/1 data products, 0 datasets and \d+ subject fields/)).toBeInTheDocument();
  });
});
