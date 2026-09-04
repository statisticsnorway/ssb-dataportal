import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { type DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { KlassCode } from '@/types/klass-codes';
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
    has_naming_standard_violations: false,
  },
  {
    product_type: DataProductType.OTHER_DATA_PRODUCT,
    product_short_name: 'ameld',
    title: 'Ameldingen',
    subject_code: 'bf',
    has_naming_standard_violations: false,
  },
];

const subjectFields: KlassCode[] = [
  { code: 'al', name: 'Arbeid og lønn', parentCode: null, level: '1', validFrom: '2020' },
  { code: 'bf', name: 'Bank og finansmarked', parentCode: null, level: '1', validFrom: '2020' },
  { code: 'he', name: 'Helse', parentCode: null, level: '1', validFrom: '2020' },
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
          has_naming_standard_violations: false,
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
          has_naming_standard_violations: false,
        },
      ],
    });
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).toHaveTextContent('Ameldingen');
    expect(main).toHaveTextContent('produkt-uten-tittel');
  });

  it('renders subject area tags in the search results', () => {
    renderPage({ subjectFields });
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(within(cards[0]!).getByLabelText(localization.subjectArea)).toHaveTextContent('Arbeid og lønn');
    expect(within(cards[1]!).getByLabelText(localization.subjectArea)).toHaveTextContent('Bank og finansmarked');
  });

  it('renders subject field checkboxes with counts', () => {
    renderPage({ subjectFields });
    const workAndPayFilter = screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' });
    const bankingFilter = screen.getByRole('checkbox', { name: 'Bank og finansmarked (1)' });
    expect(screen.getByRole('group', { name: new RegExp(localization.subjectArea) })).toBeInTheDocument();
    expect(workAndPayFilter).not.toBeChecked();
    expect(bankingFilter).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Helse (0)' })).toBeInTheDocument();
  });

  it('filters data products by selected subject fields', () => {
    renderPage({ subjectFields });
    const main = screen.getByRole('main');
    const workAndPayFilter = screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' });
    const bankingFilter = screen.getByRole('checkbox', { name: 'Bank og finansmarked (1)' });

    fireEvent.click(workAndPayFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');

    fireEvent.click(bankingFilter);
    expect(main).toHaveTextContent('2 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).toHaveTextContent('Ameldingen');

    fireEvent.click(workAndPayFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Ameldingen');
    expect(main).not.toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');

    fireEvent.click(bankingFilter);
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
          has_naming_standard_violations: false,
        },
      ],
      subjectFields,
    });
    const main = screen.getByRole('main');
    const healthFilter = screen.getByRole('checkbox', { name: 'Helse (1)' });
    fireEvent.click(healthFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Helseprodukt');
  });

  it('combines subject field filters with product type filters', () => {
    renderPage({ subjectFields });
    const main = screen.getByRole('main');
    const otherProductFilter = screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });
    const workAndPayFilter = screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' });
    fireEvent.click(otherProductFilter);
    fireEvent.click(workAndPayFilter);
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

  it('hydrates selected subject filters from subjects parameter', () => {
    renderPage({ subjectFields }, '?subjects=al');
    expect(screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' })).toBeChecked();
    expect(screen.getByRole('main')).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(screen.getByRole('main')).not.toHaveTextContent('Ameldingen');
  });

  it('updates subjects parameters when subject filters change', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({ subjectFields }, '', onUrlUpdate);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Bank og finansmarked (1)' }));
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.getAll('subjects')).toEqual(['bf']);
  });

  it('clears subjects parameter when the last selected subject is unchecked', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({ subjectFields }, '?subjects=al', onUrlUpdate);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' }));
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get('subjects')).toBeNull();
  });
});
