import { Button, Dialog, Heading, TabsPanel } from '@digdir/designsystemet-react';
import { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { localization } from '@/libs/language';
import { ResultCountLabel } from './ResultCountLabel';
import styles from './search-page.module.css';

interface SearchPageProps {
  infoContent?: ReactNode;
  infoContentInAside?: boolean;
  asideContent?: ReactNode;
  asideClassName?: string;
  activeFilterCount?: number;
  clearFilters?: () => void;
  filterDialogTitle?: string;
  searchResult?: ReactElement;
  controlsContent?: ReactNode;
  totalHits?: ReactNode;
  header?: string;
  tabsId: string;
}

/**
 * Layout wrapper for the search page.
 *
 * Provides the semantic page structure for search results, including
 * an accessible (visually hidden) level-1 heading, optional filter sidebar,
 * supplementary search information and controls, and the main results area.
 *
 * @param infoContent     Optional content displayed above results (e.g. tags or info)
 * @param infoContentInAside Whether info content is already positioned within the desktop filter panel
 * @param asideContent    Optional sidebar content for filters
 * @param asideClassName  Optional class name for customizing the filter sidebar
 * @param activeFilterCount Number of active filters displayed on the mobile filter button
 * @param clearFilters    Optional action for clearing all filters in the mobile filter dialog
 * @param searchResult    Rendered search results
 * @param controlsContent Sorting or control UI for the results list
 * @param totalHits       Total number of search results
 * @param header          Page title announced to screen readers
 */
const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  infoContentInAside = false,
  asideContent,
  asideClassName,
  activeFilterCount = 0,
  clearFilters,
  filterDialogTitle,
  searchResult,
  controlsContent,
  totalHits,
  header,
  tabsId,
}) => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const mobileViewport = window.matchMedia('(max-width: 719px)');
    const updateViewport = () => setIsMobileViewport(mobileViewport.matches);

    updateViewport();
    mobileViewport.addEventListener('change', updateViewport);

    return () => mobileViewport.removeEventListener('change', updateViewport);
  }, []);

  const hitsLabel = (totalHits?: ReactNode): ReactNode => {
    if (totalHits == null) return null;
    if (typeof totalHits === 'number') {
      return <ResultCountLabel count={totalHits} />;
    }
    return totalHits;
  };

  const infoSection = infoContent ? (
    <section
      className={styles.infoSection}
      id='filter-tags-section'
      aria-label={localization.filterTag.sectionLabel}
      style={{ scrollMarginTop: '2rem' }}
    >
      {infoContent}
    </section>
  ) : null;

  return (
    <main id={`searchpage-${tabsId}`}>
      <header>
        <Heading level={1} className='ds-sr-only'>
          {header}
        </Heading>
      </header>
      <TabsPanel id={tabsId} value={String(tabsId)} aria-labelledby={tabsId} className={styles.tabsPanel}>
        <div className={`${styles.pageContainer} container`}>
          <div className={styles.searchHitsContainerWrapper}>
            {asideContent && !isFilterDialogOpen && !isMobileViewport ? (
              <aside className={`${styles.filterSection} ${asideClassName ?? ''}`} aria-label='Filters'>
                {asideContent}
                {!infoContentInAside && infoSection}
              </aside>
            ) : null}
            <div className={styles.mainSection}>
              <div className={styles.hitsAndSort}>
                <div className={styles.hitsSortGroup}>
                  <p className={styles.numHits}>{hitsLabel(totalHits)}</p>
                  <div className={styles.mobileControls}>
                    <div className={styles.sortControls}>{controlsContent}</div>
                    {asideContent ? (
                      <Button
                        className={styles.mobileFilterButton}
                        variant='secondary'
                        aria-label={`${localization.search.filter.open} (${activeFilterCount})`}
                        aria-haspopup='dialog'
                        aria-expanded={isFilterDialogOpen}
                        aria-controls={`mobile-filter-dialog-${tabsId}`}
                        onClick={() => setIsFilterDialogOpen(true)}
                      >
                        {localization.search.filter.open} <span>({activeFilterCount})</span>
                      </Button>
                    ) : null}
                    {(isMobileViewport || !asideContent) && infoSection}
                  </div>
                </div>
              </div>
              {searchResult}
            </div>
          </div>
        </div>
        {asideContent ? (
          <Dialog
            id={`mobile-filter-dialog-${tabsId}`}
            className={styles.filterDialog}
            placement='bottom'
            open={isFilterDialogOpen}
            onClose={() => setIsFilterDialogOpen(false)}
            onClick={(event) => {
              if (event.target === event.currentTarget) setIsFilterDialogOpen(false);
            }}
            closedby='any'
            closeButton={false}
            aria-label={filterDialogTitle ?? localization.search.filter.label}
          >
            {isFilterDialogOpen ? (
              <div className={styles.filterDialogContent}>
                <div className={styles.filterDialogHeader}>
                  <Heading level={2} data-size='md'>
                    {filterDialogTitle ?? localization.search.filter.label}
                  </Heading>
                </div>
                <div className={styles.filterDialogBody}>
                  <div className={styles.filterDialogFilters}>{asideContent}</div>
                </div>
                <div className={styles.filterDialogFooter}>
                  {activeFilterCount > 0 && clearFilters ? (
                    <Button variant='tertiary' onClick={clearFilters}>
                      {localization.button.removeFilter}
                    </Button>
                  ) : (
                    <span />
                  )}
                  <div className={styles.filterDialogActions}>
                    <Button onClick={() => setIsFilterDialogOpen(false)}>
                      {localization.search.filter.showResults}
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </Dialog>
        ) : null}
      </TabsPanel>
    </main>
  );
};

export { SearchPage };
