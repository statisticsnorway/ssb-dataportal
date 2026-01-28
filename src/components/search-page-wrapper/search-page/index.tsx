import { FC, ReactElement, ReactNode } from 'react';
import { SortFields } from '@/components/sort-fields';
import { SortTypes } from '@/hooks/useSearchStateKlass';
import styles from './search-page.module.css';

interface SearchPageProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  searchResult?: ReactElement;
  searchLabel?: string;
  sortOptions?: SortTypes[];
  sortValue?: SortTypes;
  onSortChange?: (key: string) => void;
  totalHits?: number;
}

const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  asideContent,
  searchResult,
  sortOptions,
  sortValue,
  onSortChange,
  totalHits,
}) => {
  return (
    <div className={`${styles.pageContainer} container`}>
      <header>{infoContent ? infoContent : null}</header>
      <section className={styles.searchHitsContainerWrapper}>
        {asideContent ? <aside className={styles.filterSection}>{asideContent}</aside> : null}
        <main className={styles.mainSection}>
          <div className={styles.hitsAndSort}>
            <p className={styles.numHits}>{totalHits} treff</p>
            {sortOptions && sortValue && onSortChange && (
              <SortFields sortOptions={sortOptions} sortValue={sortValue} onSortChange={onSortChange} />
            )}
          </div>
          {searchResult}
        </main>
      </section>
    </div>
  );
};

export { SearchPage };
