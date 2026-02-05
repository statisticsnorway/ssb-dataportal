'use client';

import { Heading } from '@digdir/designsystemet-react';
import { FC, ReactElement, ReactNode } from 'react';
import { localization } from '@/libs/language';
import { SortTypes } from '@/types/sort';
import styles from './search-page.module.css';

interface SearchPageProps {
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  searchResult?: ReactElement;
  controlsContent?: ReactNode;
  totalHits?: number;
  searchLabel?: string;
  sortOptions?: ReadonlyArray<SortTypes>;
  sortValue?: SortTypes;
  onSortChange?: (key: SortTypes) => void;
  header?: string;
}

/**
 * Wrapper for search page content.
 *
 * Wrapper with correct semantic structure and header level 1 for accessibility hidden.
 *
 * @param param0
 * @returns
 */
const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  asideContent,
  searchResult,
  controlsContent,
  totalHits,
  header,
}) => {
  const hitsLabel = (totalHits?: number | null): string | null => {
    if (totalHits == null) return null;
    if (totalHits === 0) return localization.search.noHits;
    return `${totalHits} ${localization.search.hits}`;
  };

  return (
    <>
      <section role='region' aria-label='Page header' className='container'>
        <header>
          <Heading level={1} className='ds-sr-only'>
            {header}
          </Heading>
        </header>
      </section>
      <div className={`${styles.pageContainer} container`}>
        <section role='region' aria-label='Tags list'>
          {infoContent ? infoContent : null}
        </section>
        <div className={styles.searchHitsContainerWrapper}>
          {asideContent ? (
            <aside className={styles.filterSection} aria-label='Filters'>
              {asideContent}
            </aside>
          ) : null}
          <main className={styles.mainSection}>
            <div className={styles.hitsAndSort}>
              <p className={styles.numHits}>{hitsLabel(totalHits)}</p>
              {controlsContent}
            </div>
            {searchResult}
          </main>
        </div>
      </div>
    </>
  );
};

export { SearchPage };
