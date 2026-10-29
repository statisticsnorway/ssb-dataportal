import { Tabs } from '@digdir/designsystemet-react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FiltersPanel } from '@/components/filters/filters-panel';
import { localization } from '@/libs/language';
import { SearchPage } from './index';

const setPhone = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};

const renderPage = (props: { activeFilterCount?: number; onClearFilters?: () => void } = {}) =>
  render(
    <Tabs value='testTab'>
      <SearchPage
        tabsId='testTab'
        header='Test'
        totalHits={3}
        asideContent={
          <FiltersPanel heading='Filter heading'>
            <input aria-label='filter-input' />
          </FiltersPanel>
        }
        controlsContent={<select aria-label='sort-control' />}
        infoContent={<span>active tags</span>}
        searchResult={<div>results</div>}
        {...props}
      />
    </Tabs>,
  );

describe('SearchPage', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error reset the test-only matchMedia mock
    delete window.matchMedia;
  });

  describe('on desktop', () => {
    it('renders the filters in the sidebar and no filter sheet', () => {
      setPhone(false);
      renderPage();

      const sidebar = screen.getByRole('complementary', { hidden: true });
      expect(within(sidebar).getByLabelText('filter-input')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-filter-sheet')).toBeNull();
      expect(screen.getAllByLabelText('sort-control')).toHaveLength(1);
    });

    it('places the active filter tags in the sidebar between the heading and the first filter', () => {
      setPhone(false);
      renderPage();

      const sidebar = screen.getByRole('complementary', { hidden: true });
      const heading = within(sidebar).getByRole('heading', { name: 'Filter heading', hidden: true });
      const tags = within(sidebar).getByText('active tags');
      const input = within(sidebar).getByLabelText('filter-input');

      expect(heading.compareDocumentPosition(tags) & Node.DOCUMENT_POSITION_FOLLOWING).toBeGreaterThan(0);
      expect(tags.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeGreaterThan(0);
      expect(document.querySelectorAll('#filter-tags-section')).toHaveLength(1);
    });
  });

  describe('on phones', () => {
    beforeEach(() => setPhone(true));

    it('does not render the sidebar and renders sort once in the controls area', () => {
      renderPage();

      expect(screen.queryByRole('complementary', { hidden: true })).toBeNull();
      expect(screen.getAllByLabelText('sort-control')).toHaveLength(1);
      expect(screen.getByTestId('mobile-filter-button')).toBeInTheDocument();
    });

    it('shows the number of active filters in the filter button', () => {
      renderPage({ activeFilterCount: 3 });

      expect(screen.getByTestId('mobile-filter-button')).toHaveTextContent(`${localization.search.filter.label} (3)`);
    });

    it('omits the count when no filters are active', () => {
      renderPage({ activeFilterCount: 0 });

      expect(screen.getByTestId('mobile-filter-button')).toHaveTextContent(localization.search.filter.label);
      expect(screen.getByTestId('mobile-filter-button').textContent).not.toContain('(');
    });

    it('opens an accessible dialog with heading, filters and Show results', () => {
      renderPage({ activeFilterCount: 1, onClearFilters: vi.fn() });

      fireEvent.click(screen.getByTestId('mobile-filter-button'));

      const dialog = screen.getByTestId('mobile-filter-sheet');
      expect(dialog).toHaveAttribute('open');
      expect(dialog).toHaveAccessibleName(localization.search.filter.label);
      expect(within(dialog).getByLabelText('filter-input')).toBeInTheDocument();
      expect(
        within(dialog).getByRole('button', { name: localization.search.filter.showResults, hidden: true }),
      ).toBeInTheDocument();
    });

    it('closes the dialog with Show results', () => {
      renderPage();
      fireEvent.click(screen.getByTestId('mobile-filter-button'));

      fireEvent.click(screen.getByRole('button', { name: localization.search.filter.showResults, hidden: true }));

      expect(screen.getByTestId('mobile-filter-sheet')).not.toHaveAttribute('open');
    });

    it('offers Clear filters only when filters are active', () => {
      const onClearFilters = vi.fn();
      const { unmount } = renderPage({ activeFilterCount: 0, onClearFilters });
      fireEvent.click(screen.getByTestId('mobile-filter-button'));
      expect(screen.queryByRole('button', { name: localization.button.removeFilter, hidden: true })).toBeNull();
      unmount();

      renderPage({ activeFilterCount: 2, onClearFilters });
      fireEvent.click(screen.getByTestId('mobile-filter-button'));
      fireEvent.click(screen.getByRole('button', { name: localization.button.removeFilter, hidden: true }));

      expect(onClearFilters).toHaveBeenCalledTimes(1);
    });

    it('keeps tags, hit count and results in the page flow', () => {
      renderPage();

      expect(screen.getByText('active tags')).toBeInTheDocument();
      expect(screen.getByText(`${localization.search.numberOfHits} 3`)).toBeInTheDocument();
      expect(screen.getByText('results')).toBeInTheDocument();
    });
  });
});
