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
  hitsLabel?: string;
  searchLabel?: string;
  sortOptions?: ReadonlyArray<SortTypes>;
  sortValue?: SortTypes;
  onSortChange?: (key: SortTypes) => void;
  header?: string;
}

const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  asideContent,
  searchResult,
  controlsContent,
  totalHits,
  hitsLabel = 'treff', //TODO localization
  header,
}) => {
  return (
    <>
      <section role='region' aria-label='Page header' className='container'>
        <header>
          <Heading level={1}>{header}</Heading>
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
              <p className={styles.numHits}>
                {totalHits == null || totalHits == 0
                  ? localization.search.noHits
                  : `${totalHits} ${localization.search.hits}`}
              </p>
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
