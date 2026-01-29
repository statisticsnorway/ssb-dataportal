import { Heading } from '@digdir/designsystemet-react';
import { FC, ReactElement, ReactNode } from 'react';
import { SortFields } from '@/components/sort-fields';
import { localization } from '@/libs/language';
import { SortTypes } from '@/types/sort';
import styles from './search-page.module.css';

interface SearchPageProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  searchResult?: ReactElement;
  searchLabel?: string;
  sortOptions?: ReadonlyArray<SortTypes>;
  sortValue?: SortTypes;
  onSortChange?: (key: SortTypes) => void;
  totalHits?: number;
  header?: string;
}

const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  asideContent,
  searchResult,
  sortOptions,
  sortValue,
  onSortChange,
  totalHits,
  header,
}) => {
  return (
    <section className={`${styles.pageContainer} container`} aria-labelledby='pageTitle'>
      <div>
        <Heading level={1}>{header ? header : null}</Heading>
        {infoContent ? infoContent : null}
      </div>
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
            {sortOptions && sortValue && onSortChange && (
              <SortFields sortOptions={sortOptions} sortValue={sortValue} onSortChange={onSortChange} />
            )}
          </div>
          {searchResult}
        </main>
      </div>
    </section>
  );
};

export { SearchPage };
