import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listDataProducts } from '@/libs/data/datasets/datasets';
import type { DataProductDTO } from '@/libs/data-access/datadoc/models';
import type { CodeItem } from '@/libs/data-access/klass/models';
import DataProductsPage from './page';

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
  }: {
    dataProducts: DataProductDTO[];
    subjectFields: CodeItem[];
  }) => (
    <div>
      {dataProducts.length} data products and {subjectFields.length} subject fields
    </div>
  ),
}));

const searchParams = Promise.resolve({});

describe('DataProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes data products and subject fields to the service page', async () => {
    vi.mocked(listDataProducts).mockResolvedValue([{ product_short_name: 'arbstatus' }]);
    render(await DataProductsPage({ searchParams }));
    expect(screen.getByText(/1 data products and \d+ subject fields/)).toBeInTheDocument();
  });
});
