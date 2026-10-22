import { Tabs } from '@digdir/designsystemet-react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { localization } from '@/libs/language';
import { SearchPage } from './index';

const clearFilters = vi.fn();
let isMobileViewport = true;

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

beforeEach(() => {
  isMobileViewport = true;
  vi.stubGlobal(
    'matchMedia',
    vi.fn(
      (media: string) =>
        ({
          matches: isMobileViewport && media === '(max-width: 719px)',
          media,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const renderSearchPage = () =>
  render(
    <Tabs value='mobile-filter-test'>
      <Tabs.List>
        <Tabs.Tab aria-controls='mobile-filter-test' value='mobile-filter-test'>
          Current page
        </Tabs.Tab>
      </Tabs.List>
      <SearchPage
        tabsId='mobile-filter-test'
        header='Variable definitions'
        filterDialogTitle={localization.search.filter.filterAndSearch}
        infoContent={<span>Active filter tags</span>}
        asideContent={<div>Filter controls</div>}
        activeFilterCount={2}
        clearFilters={clearFilters}
        totalHits={5}
        searchResult={<div>Search results</div>}
      />
    </Tabs>,
  );

describe('SearchPage mobile filters', () => {
  it('opens the filter dialog, clears filters, and closes to show the results', () => {
    const { container } = renderSearchPage();

    const mobileControls = container.querySelector('[class*="mobileControls"]');
    const infoSection = container.querySelector('#filter-tags-section');
    expect(infoSection?.parentElement).toBe(mobileControls);
    expect(container.querySelectorAll('#filter-tags-section')).toHaveLength(1);

    const openButton = screen.getByRole('button', { name: `${localization.search.filter.open} (2)` });
    fireEvent.click(openButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-label', localization.search.filter.filterAndSearch);
    expect(
      within(dialog).getByRole('heading', { name: localization.search.filter.filterAndSearch }),
    ).toBeInTheDocument();
    expect(within(dialog).queryByRole('button', { name: localization.close })).not.toBeInTheDocument();
    expect(within(dialog).getByText('Filter controls')).toBeInTheDocument();
    expect(within(dialog).queryByText('5 treff')).not.toBeInTheDocument();
    expect(within(dialog).queryByText(`${localization.search.hitsCount}: 5`)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: localization.button.removeFilter }));
    expect(clearFilters).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: localization.search.filter.showResults }));
    expect(openButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Filter controls')).not.toBeInTheDocument();
    expect(screen.getByText('Active filter tags')).toBeInTheDocument();
  });

  it('closes the filter dialog when its backdrop is clicked', () => {
    renderSearchPage();

    fireEvent.click(screen.getByRole('button', { name: `${localization.search.filter.open} (2)` }));
    fireEvent.click(screen.getByRole('dialog'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('SearchPage desktop filters', () => {
  it('places active filter tags below the filters and shows the mobile hit-count label above results', () => {
    isMobileViewport = false;
    const { container } = renderSearchPage();

    const infoSection = container.querySelector('#filter-tags-section');
    const aside = container.querySelector('aside[aria-label="Filters"]');

    expect(infoSection?.parentElement).toBe(aside);
    expect(screen.getByText(`${localization.search.hitsCount}: 5`)).toBeInTheDocument();
  });
});
