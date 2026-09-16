import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DataProductDTO, DatasetDTO } from '@/libs/data-access/datadoc/models';
import DataProductDetail from './dataProductDetail';

let isAuthenticatedMock = true;

vi.mock('server-only', () => ({}));
vi.mock('@/app/authContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: isAuthenticatedMock,
    login: vi.fn(),
    logout: vi.fn(),
    user: null,
  }),
}));

vi.mock('@/libs/language', () => ({
  localization: {
    tabs: { dataProducts: 'Data products' },
    search: {
      filter: {
        label: 'Filters',
      },
      sort: {
        label: 'Sort',
        titleAlphabeticalAsc: 'Title A-Z',
        titleAlphabeticalDesc: 'Title Z-A',
        lastUpdatedFirst: 'Last changed',
      },
    },
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
      sortByMostNamingStandardViolations: 'Most naming standard violations',
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

vi.mock('@/components/sort-fields', () => ({
  SortFields: ({
    sortOptions,
    sortValue,
    onSortChange,
    sortLabels,
  }: {
    sortOptions: string[];
    sortValue: string;
    onSortChange: (value: string) => void;
    sortLabels?: Record<string, string>;
  }) => (
    <select aria-label='Sort' value={sortValue} onChange={(event) => onSortChange(event.target.value)}>
      {sortOptions.map((option) => (
        <option key={option} value={option}>
          {sortLabels?.[option] ?? option}
        </option>
      ))}
    </select>
  ),
}));

// Minimal mock of filters so we can click controls
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
  DatasetSearchHit: ({
    dataset,
    namingStandardViolationsCount,
  }: {
    dataset: DatasetDTO;
    namingStandardViolationsCount: number;
  }) => (
    <div data-testid='dataset-hit' data-violations={namingStandardViolationsCount}>
      {dataset.short_description ?? dataset.id}
    </div>
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
  beforeEach(() => {
    isAuthenticatedMock = true;
  });

  it('renders title, breadcrumbs, filters and all datasets initially', () => {
    render(
      <DataProductDetail dataProduct={dataProduct} datasets={datasets} namingStandardViolationsByDatasetId={{}} />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'My Product' })).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();

    const hits = screen.getAllByTestId('dataset-hit');
    expect(hits).toHaveLength(3);
  });

  it('filters datasets when an assessment checkbox is selected', () => {
    render(
      <DataProductDetail dataProduct={dataProduct} datasets={datasets} namingStandardViolationsByDatasetId={{}} />,
    );

    const openCheckbox = screen.getByLabelText('Open');
    fireEvent.click(openCheckbox);

    const hits = screen.getAllByTestId('dataset-hit');
    expect(hits).toHaveLength(1);
    expect(hits[0]).toHaveTextContent('Open ds');
  });

  it('supports multiple selected filters (OR filtering)', () => {
    render(
      <DataProductDetail dataProduct={dataProduct} datasets={datasets} namingStandardViolationsByDatasetId={{}} />,
    );

    fireEvent.click(screen.getByLabelText('Open'));
    fireEvent.click(screen.getByLabelText('Sensitive'));

    const hits = screen.getAllByTestId('dataset-hit');
    expect(hits).toHaveLength(2);
    expect(hits.map((n) => n.textContent)).toEqual(expect.arrayContaining(['Open ds', 'Sensitive ds']));
  });

  it('toggling a selected filter off shows all datasets again', () => {
    render(
      <DataProductDetail dataProduct={dataProduct} datasets={datasets} namingStandardViolationsByDatasetId={{}} />,
    );

    const protectedCheckbox = screen.getByLabelText('Protected');
    fireEvent.click(protectedCheckbox); // select
    expect(screen.getAllByTestId('dataset-hit')).toHaveLength(1);

    fireEvent.click(protectedCheckbox); // deselect
    expect(screen.getAllByTestId('dataset-hit')).toHaveLength(3);
  });

  it('falls back to product_short_name when title is missing', () => {
    const product = { product_short_name: 'fallback-name' } as DataProductDTO;
    render(<DataProductDetail dataProduct={product} datasets={[]} namingStandardViolationsByDatasetId={{}} />);
    expect(screen.getByRole('heading', { level: 1, name: 'fallback-name' })).toBeInTheDocument();
  });

  it('passes naming standard violation counts to dataset cards', () => {
    render(
      <DataProductDetail
        dataProduct={dataProduct}
        datasets={datasets}
        namingStandardViolationsByDatasetId={{ '1': 4, '2': 0, '3': 1 }}
      />,
    );

    const hits = screen.getAllByTestId('dataset-hit');
    expect(hits[0]).toHaveAttribute('data-violations', '4');
    expect(hits[1]).toHaveAttribute('data-violations', '0');
    expect(hits[2]).toHaveAttribute('data-violations', '1');
  });

  it('shows sorting controls for authenticated users', () => {
    render(
      <DataProductDetail
        dataProduct={dataProduct}
        datasets={datasets}
        namingStandardViolationsByDatasetId={{ '1': 1 }}
      />,
    );

    expect(screen.getByLabelText('Sort')).toBeInTheDocument();
  });

  it('shows only alphabetical sort options for unauthenticated users', () => {
    isAuthenticatedMock = false;

    render(
      <DataProductDetail
        dataProduct={dataProduct}
        datasets={datasets}
        namingStandardViolationsByDatasetId={{ '1': 1 }}
      />,
    );

    const sortSelect = screen.getByLabelText('Sort');
    expect(sortSelect).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Most naming standard violations' })).not.toBeInTheDocument();
  });

  it('sorts datasets by naming standard violations when selected', () => {
    render(
      <DataProductDetail
        dataProduct={dataProduct}
        datasets={datasets}
        namingStandardViolationsByDatasetId={{ '1': 1, '2': 4, '3': 2 }}
      />,
    );

    fireEvent.change(screen.getByLabelText('Sort'), { target: { value: 'violationsDesc' } });

    const hits = screen.getAllByTestId('dataset-hit');
    expect(hits.map((hit) => hit.textContent)).toEqual(['Protected ds', 'Sensitive ds', 'Open ds']);
  });
});
