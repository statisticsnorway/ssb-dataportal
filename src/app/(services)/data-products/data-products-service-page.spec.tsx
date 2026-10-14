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
    contains_valid_datasets: false,
  },
  {
    product_type: DataProductType.OTHER_DATA_PRODUCT,
    product_short_name: 'ameld',
    title: 'Ameldingen',
    subject_code: 'bf',
    contains_valid_datasets: false,
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

const openProductTypeFilters = () => {
  fireEvent.click(
    screen.getByRole('button', {
      name: new RegExp(localization.products.typeFilterLabel),
    }),
  );
};

describe('DataProductsServicePage', () => {
  it('starts the name and product type filters collapsed', () => {
    renderPage();

    expect(
      screen.getByRole('button', {
        name: new RegExp(localization.search.textFilter.label),
      }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getByRole('button', {
        name: new RegExp(localization.products.typeFilterLabel),
      }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('searchbox', { name: localization.search.textFilter.label })).not.toBeVisible();
    expect(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' })).not.toBeVisible();
  });

  it('renders product type checkboxes with counts', () => {
    renderPage();
    openProductTypeFilters();
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
          contains_valid_datasets: false,
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
    openProductTypeFilters();
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
          contains_valid_datasets: false,
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

    const workCard = screen
      .getAllByRole('article')
      .find((card) => card.textContent?.includes('Tilknytning til arbeid'));

    const bankingCard = screen.getAllByRole('article').find((card) => card.textContent?.includes('Ameldingen'));

    expect(workCard).toBeDefined();
    expect(bankingCard).toBeDefined();

    expect(within(workCard!).getByLabelText(localization.subjectArea)).toHaveTextContent('Arbeid og lønn');
    expect(within(bankingCard!).getByLabelText(localization.subjectArea)).toHaveTextContent('Bank og finansmarked');
  });

  it('renders subject field filters nested under product type with statistical product counts', () => {
    renderPage({ subjectFields });
    openProductTypeFilters();
    const productTypeFilters = screen.getByRole('group', {
      name: new RegExp(localization.products.typeFilterLabel),
    });
    expect(
      within(productTypeFilters).queryByRole('group', {
        name: new RegExp(localization.subjectArea),
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(within(productTypeFilters).getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    const subjectFilters = within(productTypeFilters).getByRole('group', {
      name: new RegExp(localization.subjectArea),
    });
    expect(within(subjectFilters).getByText(localization.subjectArea)).toHaveClass('ds-sr-only');
    const workAndPayFilter = within(subjectFilters).getByRole('checkbox', { name: 'Arbeid og lønn (1)' });
    const bankingFilter = within(subjectFilters).getByRole('checkbox', { name: 'Bank og finansmarked (0)' });
    expect(workAndPayFilter).not.toBeChecked();
    expect(bankingFilter).not.toBeChecked();
    expect(within(subjectFilters).getByRole('checkbox', { name: 'Helse (0)' })).toBeInTheDocument();
  });

  it('hides statistical product filters and clears their selections when the parent is unchecked', () => {
    renderPage({ subjectFields });
    openProductTypeFilters();
    const statisticProductFilter = screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' });
    fireEvent.click(statisticProductFilter);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' }));
    expect(screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' })).toBeChecked();

    fireEvent.click(statisticProductFilter);
    expect(screen.queryByRole('checkbox', { name: 'Arbeid og lønn (1)' })).not.toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('2 treff');
  });

  it('supports optional help text for the statistical product filter', () => {
    renderPage({
      subjectFields,
      statisticProductFilterHelp: {
        heading: 'Hva er et statistikkprodukt?',
        text: 'Eksempel på hjelpetekst.',
      },
    });
    openProductTypeFilters();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    const helpHeading = screen.getByText('Hva er et statistikkprodukt?');
    const helpText = screen.getByText('Eksempel på hjelpetekst.');
    expect(helpText).not.toBeVisible();

    fireEvent.click(helpHeading);
    expect(helpText).toBeVisible();
  });

  it('filters data products by selected subject fields', () => {
    renderPage({ subjectFields });
    openProductTypeFilters();
    const main = screen.getByRole('main');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    const workAndPayFilter = screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' });
    const bankingFilter = screen.getByRole('checkbox', { name: 'Bank og finansmarked (0)' });

    fireEvent.click(workAndPayFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');

    fireEvent.click(bankingFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');

    fireEvent.click(workAndPayFilter);
    expect(main).toHaveTextContent('0 treff');
    expect(main).toHaveTextContent(localization.search.noHits);

    fireEvent.click(bankingFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');
  });

  it('normalizes child subject field codes to parent subject areas', () => {
    renderPage({
      dataProducts: [
        {
          product_type: DataProductType.STATISTIC_PRODUCT,
          product_short_name: 'health-product',
          title: 'Helseprodukt',
          subject_code: 'hel2',
          contains_valid_datasets: false,
        },
      ],
      subjectFields,
    });
    openProductTypeFilters();
    const main = screen.getByRole('main');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    const healthFilter = screen.getByRole('checkbox', { name: 'Helse (1)' });
    fireEvent.click(healthFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Helseprodukt');
  });

  it('combines subject field filters with product type filters', () => {
    renderPage({ subjectFields });
    openProductTypeFilters();
    const main = screen.getByRole('main');
    const otherProductFilter = screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    const workAndPayFilter = screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' });
    fireEvent.click(otherProductFilter);
    fireEvent.click(workAndPayFilter);
    expect(main).toHaveTextContent('2 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).toHaveTextContent('Ameldingen');
  });
});
describe('URL state', () => {
  it('hydrates selected product type filters from productTypes parameters', () => {
    renderPage({}, '?productTypes=STATISTIC_PRODUCT,OTHER_DATA_PRODUCT');
    openProductTypeFilters();
    expect(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' })).toBeChecked();
  });

  it('updates productTypes parameters when product type filters change', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({}, '', onUrlUpdate);
    openProductTypeFilters();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.getAll('productTypes')).toEqual(['STATISTIC_PRODUCT']);
  });

  it('clears productTypes parameter when the last selected product type is unchecked', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({}, '?productTypes=STATISTIC_PRODUCT', onUrlUpdate);
    openProductTypeFilters();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get('productTypes')).toBeNull();
  });

  it('hydrates selected subject filters from subjects parameter', () => {
    renderPage({ subjectFields }, '?subjects=al');
    openProductTypeFilters();
    expect(screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' })).toBeChecked();
    expect(screen.getByRole('main')).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(screen.getByRole('main')).not.toHaveTextContent('Ameldingen');
  });

  it('updates subjects parameters when subject filters change', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({ subjectFields }, '', onUrlUpdate);
    openProductTypeFilters();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Bank og finansmarked (0)' }));
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.getAll('subjects')).toEqual(['bf']);
  });

  it('clears subjects parameter when the last selected subject is unchecked', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    renderPage({ subjectFields }, '?subjects=al', onUrlUpdate);
    openProductTypeFilters();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Arbeid og lønn (1)' }));
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get('subjects')).toBeNull();
  });
});
