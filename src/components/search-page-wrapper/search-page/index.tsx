'use client';
import { FC, ReactElement, ReactNode } from 'react';
import { FiltersPanel } from '@/components/filter';
import { SortFields } from '@/components/sort-fields';
import { SortTypes } from '@/hooks/useSearchStateKlass';
import { FilterGroup } from '@/types/filters';
import styles from './search-page.module.css';

interface SearchPageProps {
  infoContent?: ReactNode;
  searchResult?: ReactElement;
  filterGroups?: FilterGroup[];
  sortOptions?: SortTypes[];
  sortValue?: SortTypes;
  onSortChange?: (key: string) => void;
  totalHits?: number;
}

const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  searchResult,
  filterGroups,
  sortOptions,
  sortValue,
  onSortChange,
  totalHits,
}) => {
  return (
    <div className={`${styles.pageContainer} container`}>
      <section className={styles.infoSection}>
        <div>{infoContent}</div>
      </section>
      <section className={styles.searchHitsContainer}>
        <aside className={styles.filterSection}>
          {filterGroups ? <FiltersPanel filterGroups={filterGroups} /> : null}
        </aside>
        <section className={styles.mainSection}>
          <div className={styles.hitsAndSort}>
            <p className={styles.numHits}>{totalHits} treff</p>
            {sortOptions && sortValue && onSortChange && (
              <SortFields sortOptions={sortOptions} sortValue={sortValue} onSortChange={onSortChange} />
            )}
          </div>
          {searchResult}
        </section>
      </section>
    </div>
  );
};

export { SearchPage };
