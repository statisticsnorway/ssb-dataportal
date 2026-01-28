'use client';

import { FC, ReactElement, ReactNode } from 'react';
import styles from './search-page.module.css';

interface SearchPageProps {
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  searchResult?: ReactElement;
  controlsContent?: ReactNode;
  totalHits?: number;
  hitsLabel?: string;
}

const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  asideContent,
  searchResult,
  controlsContent,
  totalHits,
  hitsLabel = 'treff', //TODO localization
}) => {
  return (
    <div className={`${styles.pageContainer} container`}>
      {infoContent}

      <section className={styles.searchHitsContainerWrapper}>
        {asideContent && <aside className={styles.filterSection}>{asideContent}</aside>}

        <section className={styles.mainSection}>
          <div className={styles.hitsAndSort}>
            {totalHits !== undefined && (
              <p className={styles.numHits}>
                {totalHits} {hitsLabel}
              </p>
            )}
            {controlsContent}
          </div>
          {searchResult}
        </section>
      </section>
    </div>
  );
};

export { SearchPage };
