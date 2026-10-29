'use client';

import { Button, Heading, TabsPanel } from '@digdir/designsystemet-react';
import { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { FilterTagsSlotContext } from '@/components/filters/filters-panel/filter-tags-slot';
import { useIsPhone } from '@/hooks/useIsPhone';
import { localization } from '@/libs/language';
import { MobileFilterSheet } from '../mobile-filter-sheet';
import styles from './search-page.module.css';

interface SearchPageProps {
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  asideClassName?: string;
  searchResult?: ReactElement;
  controlsContent?: ReactNode;
  totalHits?: ReactNode;
  header?: string;
  tabsId: string;
  filtersHeading?: string;
  activeFilterCount?: number;
  onClearFilters?: () => void;
}

/**
 * Layout wrapper for the search page.
 *
 * Provides the semantic page structure for search results, including
 * an accessible (visually hidden) level-1 heading, optional filter sidebar,
 * supplementary search information and controls, and the main results area.
 *
 * @param infoContent     Optional content displayed above results (e.g. tags or info)
 * @param asideContent    Optional sidebar content for filters
 * @param asideClassName  Optional class name for customizing the filter sidebar
 * @param searchResult    Rendered search results
 * @param controlsContent Sorting or control UI for the results list
 * @param totalHits       Total number of search results
 * @param header          Page title announced to screen readers
 * @param filtersHeading  Heading of the filter bottom sheet shown on phones
 * @param activeFilterCount Number of active filters (including search text), shown in the phone filter button
 * @param onClearFilters  Clears all filters, offered in the phone filter bottom sheet
 */
const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  asideContent,
  asideClassName,
  searchResult,
  controlsContent,
  totalHits,
  header,
  tabsId,
  filtersHeading = localization.search.filter.label,
  activeFilterCount = 0,
  onClearFilters,
}) => {
  const isPhone = useIsPhone();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    if (!isPhone) setIsFilterSheetOpen(false);
  }, [isPhone]);

  const hitsLabel = (totalHits?: ReactNode): ReactNode => {
    if (totalHits == null) return null;
    if (typeof totalHits === 'number') {
      if (totalHits === 0) return localization.search.noHits;
      return `${localization.search.numberOfHits} ${totalHits}`;
    }
    return totalHits;
  };

  return (
    <main id={`searchpage-${tabsId}`}>
      <header>
        <Heading level={1} className='ds-sr-only'>
          {header}
        </Heading>
      </header>
      <TabsPanel className={styles.tabsPanel} id={tabsId} value={String(tabsId)} aria-labelledby={tabsId}>
        <div className={`${styles.pageContainer} container`}>
          <div className={styles.searchHitsContainerWrapper}>
            {asideContent && !isPhone ? (
              <aside className={`${styles.filterSection} ${asideClassName ?? ''}`} aria-label='Filters'>
                <FilterTagsSlotContext.Provider value={infoContent}>{asideContent}</FilterTagsSlotContext.Provider>
              </aside>
            ) : null}
            <div className={styles.mainSection}>
              {asideContent ? (
                <div className={styles.mobilePanel}>
                  <div className={styles.mobileControls}>
                    {isPhone ? controlsContent : null}
                    <Button
                      variant='secondary'
                      className={styles.filterButton}
                      aria-haspopup='dialog'
                      onClick={() => setIsFilterSheetOpen(true)}
                      data-testid='mobile-filter-button'
                    >
                      {activeFilterCount > 0
                        ? `${localization.search.filter.label} (${activeFilterCount})`
                        : localization.search.filter.label}
                    </Button>
                  </div>
                  {isPhone ? (
                    <section
                      id='filter-tags-section'
                      aria-label={localization.filterTag.sectionLabel}
                      style={{ scrollMarginTop: '2rem' }}
                    >
                      {infoContent}
                    </section>
                  ) : null}
                </div>
              ) : null}
              <div className={styles.hitsAndSort}>
                <div className={styles.hitsSortGroup}>
                  <p className={styles.numHits}>{hitsLabel(totalHits)}</p>
                  {isPhone ? null : controlsContent}
                </div>
              </div>
              {searchResult}
            </div>
            {asideContent && isPhone ? (
              <MobileFilterSheet
                open={isFilterSheetOpen}
                onClose={() => setIsFilterSheetOpen(false)}
                heading={filtersHeading}
                activeFilterCount={activeFilterCount}
                onClearFilters={onClearFilters}
              >
                {asideContent}
              </MobileFilterSheet>
            ) : null}
          </div>
        </div>
      </TabsPanel>
    </main>
  );
};

export { SearchPage };
