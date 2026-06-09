import { fireEvent, render, screen } from '@testing-library/react';
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

describe('DataProductsServicePage', () => {
  it('renders product type checkboxes with counts', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} />);
    const statisticProductFilter = screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' });
    const otherProductFilter = screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });
    expect(screen.getByRole('group', { name: new RegExp(localization.products.typeFilterLabel) })).toBeInTheDocument();
    expect(statisticProductFilter).not.toBeChecked();
    expect(otherProductFilter).not.toBeChecked();
  });

  it('renders title or short name for each data product', () => {
    render(
      <DataProductsServicePage
        dataProducts={[
          ...dataProducts,
          {
            product_type: DataProductType.OTHER_DATA_PRODUCT,
            product_short_name: 'kortnavn',
          },
        ]}
      />,
    );

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
    render(<DataProductsServicePage dataProducts={dataProducts} />);
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

  it('renders title or short name for each data product', () => {
    render(
      <DataProductsServicePage
        dataProducts={[
          ...dataProducts,
          {
            product_type: DataProductType.OTHER_DATA_PRODUCT,
            product_short_name: 'produkt-uten-tittel',
          },
        ]}
      />,
    );
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).toHaveTextContent('Ameldingen');
    expect(main).toHaveTextContent('produkt-uten-tittel');
  });

  it('renders subject field dropdown options with counts', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} subjectFields={subjectFields} />);
    const subjectFieldFilter = screen.getByRole('combobox', { name: localization.subjectArea });
    expect(screen.getByRole('group', { name: new RegExp(localization.subjectArea) })).toBeInTheDocument();
    expect(subjectFieldFilter).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Alle statistikkområder' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Arbeid og lønn (1)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bank og finansmarked (1)' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Helse (0)' })).not.toBeInTheDocument();
  });

  it('filters data products by selected subject field', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} subjectFields={subjectFields} />);
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
    render(
      <DataProductsServicePage
        dataProducts={[
          {
            product_type: DataProductType.STATISTIC_PRODUCT,
            product_short_name: 'health-product',
            title: 'Helseprodukt',
            subject_code: 'hel2',
          },
        ]}
        subjectFields={subjectFields}
      />,
    );
    const main = screen.getByRole('main');
    const subjectFieldFilter = screen.getByRole('combobox', { name: localization.subjectArea });
    fireEvent.change(subjectFieldFilter, { target: { value: 'he' } });
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Helseprodukt');
  });

  it('combines subject field filters with product type filters', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} subjectFields={subjectFields} />);
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
