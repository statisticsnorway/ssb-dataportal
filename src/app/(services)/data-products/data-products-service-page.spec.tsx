import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Assessment, type DataProductDTO, DataProductType, type DatasetDTO } from '@/libs/data-access/datadoc/models';
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

const datasets: DatasetDTO[] = [
  {
    id: 'ds-1',
    product_short_name: 'arbstatus',
    short_description: 'Arbeidsstatus datasett 1',
    assessment: Assessment.OPEN,
  },
  {
    id: 'ds-2',
    product_short_name: 'arbstatus',
    short_description: 'Arbeidsstatus datasett 2',
    assessment: Assessment.PROTECTED,
  },
  {
    id: 'ds-3',
    product_short_name: 'ameld',
    short_description: 'Ameldingen dataset',
    assessment: Assessment.OPEN,
  },
];

describe('DataProductsServicePage', () => {
  it('renders product type checkboxes with counts', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} datasets={datasets} />);
    const statisticProductFilter = screen.getByRole('checkbox', { name: 'Statistikkprodukt (1)' });
    const otherProductFilter = screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });
    expect(screen.getByRole('group', { name: new RegExp(localization.products.typeFilterLabel) })).toBeInTheDocument();
    expect(statisticProductFilter).not.toBeChecked();
    expect(otherProductFilter).not.toBeChecked();
  });

  it('filters data products by selected product types', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} datasets={datasets} />);
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

  it('renders assessment checkboxes with counts', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} datasets={datasets} />);
    const openAssessmentFilter = screen.getByRole('checkbox', { name: 'Åpen (2)' });
    const protectedAssessmentFilter = screen.getByRole('checkbox', { name: 'Beskyttet (1)' });
    expect(
      screen.getByRole('group', { name: new RegExp(localization.products.assessment.filterLabel) }),
    ).toBeInTheDocument();
    expect(openAssessmentFilter).not.toBeChecked();
    expect(protectedAssessmentFilter).not.toBeChecked();
  });

  it('filters data products by selected dataset assessments', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} datasets={datasets} />);
    const main = screen.getByRole('main');
    const protectedAssessmentFilter = screen.getByRole('checkbox', { name: 'Beskyttet (1)' });
    fireEvent.click(protectedAssessmentFilter);
    expect(main).toHaveTextContent('1 treff');
    expect(main).toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');
  });

  it('combines product type and assessment filters', () => {
    render(<DataProductsServicePage dataProducts={dataProducts} datasets={datasets} />);
    const main = screen.getByRole('main');
    const otherProductFilter = screen.getByRole('checkbox', { name: 'Annen dataprodukt (1)' });
    const protectedAssessmentFilter = screen.getByRole('checkbox', { name: 'Beskyttet (1)' });
    fireEvent.click(otherProductFilter);
    fireEvent.click(protectedAssessmentFilter);
    expect(main).toHaveTextContent('0 treff');
    expect(main).toHaveTextContent(localization.search.noHits);
    expect(main).not.toHaveTextContent('Tilknytning til arbeid, utdanning og velferdsordninger');
    expect(main).not.toHaveTextContent('Ameldingen');
  });
});
