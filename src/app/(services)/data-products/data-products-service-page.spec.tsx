import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { type DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import type { CodeItem } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { DataProductsServicePage } from './data-products-service-page';

vi.mock('server-only', () => ({}));
vi.mock('@/app/authContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    user: null,
  }),
}));

vi.mock('@/components/search-page-wrapper/search-page', () => {
  const SearchPage = ({
    header,
    totalHits,
    infoContent,
    asideContent,
    searchResult,
  }: {
    header?: string;
    totalHits?: unknown;
    infoContent?: ReactNode;
    asideContent?: ReactNode;
    searchResult?: ReactNode;
  }) => (
    <main>
      <h1>{header}</h1>
      <p>{typeof totalHits === 'number' ? `${totalHits} treff` : String(totalHits ?? '')}</p>
      <section>{infoContent}</section>
      <aside>{asideContent}</aside>
      <section>{searchResult}</section>
    </main>
  );
  return { SearchPage };
});

const dataProducts: DataProductDTO[] = [
  {
    product_type: DataProductType.STATISTIC_PRODUCT,
    product_short_name: 'arbstatus',
    title: 'Tilknytning til arbeid, utdanning og velferdsordninger',
    subject_code: 'al05',
  },
  {
    product_type: DataProductType.OTHER_DATA_PRODUCT,
    product_short_name: 'ameld',
    title: 'Ameldingen',
    subject_code: 'bf',
  },
];

const subjectFields: CodeItem[] = [
  { code: 'al', name: 'Arbeid og lønn' },
  { code: 'bf', name: 'Bank og finansmarked' },
  { code: 'he', name: 'Helse' },
];

const renderPage = (
  props: Partial<Parameters<typeof DataProductsServicePage>[0]> = {},
  searchParams = '',
  onUrlUpdate: (event: UrlUpdateEvent) => void = vi.fn(),
) => {
  return render(
    <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
      <DataProductsServicePage dataProducts={dataProducts} {...props} />
    </NuqsTestingAdapter>,
  );
};

describe('DataProductsServicePage', () => {
  it('renders product type checkboxes with counts', () => {
    renderPage();
    const statisticProductFilter = screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' });
    const otherProductFilter = screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });
    expect(screen.getByRole('group', { name: new RegExp(localization.products.typeFilterLabel) })).toBeInTheDocument();
    expect(statisticProductFilter).not.toBeChecked();
    expect(otherProductFilter).not.toBeChecked();
  });

  it('renders title or short name as data product link text', () => {
    renderPage({
      dataProducts: [
        ...dataProducts,
        {
          product_type: DataProductType.OTHER_DATA_PRODUCT,
          product_short_name: 'kortnavn',
        },
      ],
    });
    expect(
      screen.getByRole('link', {
        name: 'Tilknytning til arbeid, utdanning og velferdsordninger',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'kortnavn',
      }),
    ).toBeInTheDocument();
  });

  it('filters data products by selected product types', () => {
    renderPage();
    const main = screen.getByRole('main');
    const statisticProductFilter = screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' });
    const otherProductFilter = screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });
    fireEvent.click(statisticProductFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');
    fireEvent.click(otherProductFilter);
    expect(main).toHaveTextContent('2 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).toHaveTextContent('Ameldingen');
    fireEvent.click(statisticProductFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Ameldingen');
    expect(main).not.toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
  });

  it('renders title or short name in the search results', () => {
    renderPage({
      dataProducts: [
        ...dataProducts,
        {
          product_type: DataProductType.OTHER_DATA_PRODUCT,
          product_short_name: 'produkt-uten-tittel',
        },
      ],
    });
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).toHaveTextContent('Ameldingen');
    expect(main).toHaveTextContent('produkt-uten-tittel');
  });

  it('renders subject field dropdown options with counts', () => {
    renderPage({ subjectFields });
    const subjectFieldFilter = screen.getByRole('combobox', { name: localization.subjectArea });
    expect(screen.getByRole('group', { name: new RegExp(localization.subjectArea) })).toBeInTheDocument();
    expect(subjectFieldFilter).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Alle statistikkområder' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Arbeid og lønn (1)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bank og finansmarked (1)' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Helse (0)' })).not.toBeInTheDocument();
  });

  it('filters data products by selected subject field', () => {
    renderPage({ subjectFields });
    const main = screen.getByRole('main');
    const subjectFieldFilter = screen.getByRole('combobox', { name: localization.subjectArea });
    fireEvent.change(subjectFieldFilter, { target: { value: 'al' } });
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');
    fireEvent.change(subjectFieldFilter, { target: { value: 'bf' } });
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Ameldingen');
    expect(main).not.toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    fireEvent.change(subjectFieldFilter, { target: { value: '' } });
    expect(main).toHaveTextContent('2 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).toHaveTextContent('Ameldingen');
  });

  it('normalizes child subject field codes to parent subject areas', () => {
    renderPage({
      dataProducts: [
        {
          product_type: DataProductType.STATISTIC_PRODUCT,
          product_short_name: 'health-product',
          title: 'Helseprodukt',
          subject_code: 'hel2',
        },
      ],
      subjectFields,
    });
    const main = screen.getByRole('main');
    const subjectFieldFilter = screen.getByRole('combobox', { name: localization.subjectArea });
    fireEvent.change(subjectFieldFilter, { target: { value: 'he' } });
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Helseprodukt');
  });

  it('combines subject field filters with product type filters', () => {
    renderPage({ subjectFields });
    const main = screen.getByRole('main');
    const otherProductFilter = screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });
    const subjectFieldFilter = screen.getByRole('combobox', { name: localization.subjectArea });
    fireEvent.click(otherProductFilter);
    fireEvent.change(subjectFieldFilter, { target: { value: 'al' } });
    expect(main).toHaveTextContent('0 treff');
    expect(main).toHaveTextContent(localization.search.noHits);
    expect(main).not.toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');
  });
});
describe('URL state', () => {
  it('hydrates selected product type filters from productTypes parameters', () => {
    renderPage({}, '?productTypes=STATISTIC_PRODUCT,OTHER_DATA_PRODUCT');
    expect(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' })).toBeChecked();
  });

  it('updates productTypes parameters when product type filters change', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({}, '', onUrlUpdate);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.getAll('productTypes')).toEqual(['STATISTIC_PRODUCT']);
  });

  it('clears productTypes parameter when the last selected product type is unchecked', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({}, '?productTypes=STATISTIC_PRODUCT', onUrlUpdate);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get('productTypes')).toBeNull();
  });

  it('hydrates selected subject area from subject parameter', () => {
    renderPage({ subjectFields }, '?subject=al');
    expect(screen.getByRole('combobox', { name: localization.subjectArea })).toHaveValue('al');
    expect(screen.getByRole('main')).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(screen.getByRole('main')).not.toHaveTextContent('Ameldingen');
  });

  it('updates subjectArea parameter when subject area filter changes', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({ subjectFields }, '', onUrlUpdate);
    fireEvent.change(screen.getByRole('combobox', { name: localization.subjectArea }), {
      target: { value: 'bf' },
    });
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get('subject')).toBe('bf');
  });

  it('clears subjectArea parameter when all subject areas are selected', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({ subjectFields }, '?subject=al', onUrlUpdate);
    fireEvent.change(screen.getByRole('combobox', { name: localization.subjectArea }), {
      target: { value: '' },
    });
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get('subject')).toBeNull();
  });
});
