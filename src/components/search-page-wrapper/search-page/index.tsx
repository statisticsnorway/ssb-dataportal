import { Heading, TabsPanel } from '@digdir/designsystemet-react';
import { FC, ReactElement, ReactNode } from 'react';
import { localization } from '@/libs/language';
import { SortTypes } from '@/types/sort';
import styles from './search-page.module.css';

interface SearchPageProps {
  banner?: ReactNode;
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  searchResult?: ReactElement;
  controlsContent?: ReactNode;
  totalHits?: ReactNode;
  sortOptions?: ReadonlyArray<SortTypes>;
  sortValue?: SortTypes;
  onSortChange?: (key: SortTypes) => void;
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
 * @param asideContent    Optional sidebar content for filters
 * @param searchResult    Rendered search results
 * @param controlsContent Sorting or control UI for the results list
 * @param totalHits       Total number of search results
 * @param header          Page title announced to screen readers
 */
const SearchPage: FC<SearchPageProps> = ({
  banner,
  infoContent,
  asideContent,
  searchResult,
  controlsContent,
  totalHits,
  header,
  tabsId,
}) => {
  const hitsLabel = (totalHits?: ReactNode): ReactNode => {
    if (totalHits == null) return null;
    if (typeof totalHits === 'number') {
      if (totalHits === 0) return localization.search.noHits;
      return `${totalHits} ${localization.search.hits}`;
    }
    return totalHits;
  };

  return (
    <main id='variableDefinitionsPage'>
      <header>
        <Heading level={1} className='ds-sr-only'>
          {header}
        </Heading>
      </header>
      <TabsPanel id={tabsId} value={String(tabsId)} aria-labelledby={tabsId}>
        <div className={`${styles.pageContainer} container`}>
          {banner}
          <div className={styles.searchHitsContainerWrapper}>
            {asideContent ? (
              <aside className={styles.filterSection} aria-label='Filters'>
                {asideContent}
              </aside>
            ) : null}
            <div className={styles.mainSection}>
              <div className={styles.hitsAndSort}>
                <section aria-label='Tags list'>{infoContent}</section>
                <div className={styles.hitsSortGroup}>
                  <p className={styles.numHits}>{hitsLabel(totalHits)}</p>
                  {controlsContent}
                </div>
              </div>
              {searchResult}
            </div>
          </div>
        </div>
      </TabsPanel>
    </main>
  );
};

export { SearchPage };
