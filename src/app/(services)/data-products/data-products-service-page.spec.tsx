import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { type DataProductDTO, DataProductType } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { DataProductsServicePage } from './data-products-service-page';

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
  },
  {
    product_type: DataProductType.OTHER_DATA_PRODUCT,
    product_short_name: 'ameld',
    title: 'Ameldingen',
  },
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
});
