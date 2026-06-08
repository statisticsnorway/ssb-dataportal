import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { DataProductDTO, DatasetDTO } from '@/libs/data-access/datadoc/models';
import DataProductDetail from './dataProductDetail';

vi.mock('server-only', () => ({}));
vi.mock('@/app/authContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    user: null,
  }),
}));

vi.mock('@/libs/language', () => ({
  localization: {
    tabs: { dataProducts: 'Data products' },
    products: {
      assessment: {
        filterLabel: 'Assessment',
        protected: 'Protected',
        open: 'Open',
        sensitive: 'Sensitive',
      },
    },
    dataProductDetail: {
      dataProductFilters: 'Filters',
      dataset: 'Datasets',
    },
  },
}));

vi.mock('@/app/(services)/tabs', () => ({
  tabsData: { DataProducts: { route: '/data-products' } },
}));

vi.mock('@/utils/breadcrumbs', () => ({
  getHomeBreadcrumb: () => '/',
}));

vi.mock('@/components/dataportal-breadcrumbs', () => ({
  DataportalBreadcrumbs: () => <nav data-testid='breadcrumbs' />,
}));

// Minimal mock of CheckboxFilter so we can click checkboxes
vi.mock('@/components/filters', () => {
  const FiltersPanel = ({ children }: { children: React.ReactNode }) => (
    <div data-testid='filters-panel'>{children}</div>
  );

  const CheckboxFilter = ({
    filterHeading,
    filters,
    selectedItems,
    onFilterChange,
  }: {
    filterHeading: string;
    filters: { value: string; label: string }[];
    selectedItems: { value: string; label: string }[];
    onFilterChange: (filter: { value: string; label: string }) => void;
  }) => (
    <fieldset>
      <legend>{filterHeading}</legend>
      {filters.map((f) => (
        <label key={f.value}>
          <input
            type='checkbox'
            checked={selectedItems.some((s) => s.value === f.value)}
            onChange={() => onFilterChange(f)}
          />
          {f.label}
        </label>
      ))}
    </fieldset>
  );

  return { CheckboxFilter, FiltersPanel };
});

vi.mock('./components/DatasetSearchHit', () => ({
  DatasetSearchHit: ({ dataset }: { dataset: DatasetDTO }) => (
    <div data-testid='dataset-hit'>{dataset.short_description ?? dataset.id}</div>
  ),
}));

vi.mock('./page.module.css', () => ({
  default: new Proxy({}, { get: (_t, p) => String(p) }),
}));

// --- Test data ---
const dataProduct = {
  title: 'My Product',
  product_short_name: 'mp',
} as DataProductDTO;

const datasets = [
  { id: '1', short_description: 'Open ds', assessment: 'OPEN' },
  { id: '2', short_description: 'Protected ds', assessment: 'PROTECTED' },
  { id: '3', short_description: 'Sensitive ds', assessment: 'SENSITIVE' },
] as unknown as DatasetDTO[];

// --- Tests ---
describe('DataProductDetail', () => {
  it('renders title, breadcrumbs, filters and all datasets initially', () => {
    render(<DataProductDetail dataProduct={dataProduct} datasets={datasets} />);

    expect(screen.getByRole('heading', { level: 1, name: 'My Product' })).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();

    const hits = screen.getAllByTestId('dataset-hit');
    expect(hits).toHaveLength(3);
  });

  it('filters datasets when an assessment checkbox is selected', () => {
    render(<DataProductDetail dataProduct={dataProduct} datasets={datasets} />);

    const openCheckbox = screen.getByLabelText('Open');
    fireEvent.click(openCheckbox);

    const hits = screen.getAllByTestId('dataset-hit');
    expect(hits).toHaveLength(1);
    expect(hits[0]).toHaveTextContent('Open ds');
  });

  it('supports multiple selected filters (OR filtering)', () => {
    render(<DataProductDetail dataProduct={dataProduct} datasets={datasets} />);

    fireEvent.click(screen.getByLabelText('Open'));
    fireEvent.click(screen.getByLabelText('Sensitive'));

    const hits = screen.getAllByTestId('dataset-hit');
    expect(hits).toHaveLength(2);
    expect(hits.map((n) => n.textContent)).toEqual(expect.arrayContaining(['Open ds', 'Sensitive ds']));
  });

  it('toggling a selected filter off shows all datasets again', () => {
    render(<DataProductDetail dataProduct={dataProduct} datasets={datasets} />);

    const protectedCheckbox = screen.getByLabelText('Protected');
    fireEvent.click(protectedCheckbox); // select
    expect(screen.getAllByTestId('dataset-hit')).toHaveLength(1);

    fireEvent.click(protectedCheckbox); // deselect
    expect(screen.getAllByTestId('dataset-hit')).toHaveLength(3);
  });

  it('falls back to product_short_name when title is missing', () => {
    const product = { product_short_name: 'fallback-name' } as DataProductDTO;
    render(<DataProductDetail dataProduct={product} datasets={[]} />);
    expect(screen.getByRole('heading', { level: 1, name: 'fallback-name' })).toBeInTheDocument();
  });
});
