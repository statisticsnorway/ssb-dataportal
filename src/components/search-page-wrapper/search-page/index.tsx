import { FC, ReactElement, ReactNode } from 'react';
import { SortFields } from '@/components/sort-fields';
import { SortTypes } from '@/hooks/useSearchStateKlass';
import { FilterGroup } from '@/types/filters';
import styles from './search-page.module.css';

interface SearchPageProps {
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  searchResult?: ReactElement;
  filterGroups?: FilterGroup[];
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
      {infoContent ? <div className={styles.infoSection}>{infoContent}</div> : null}
      <section className={styles.searchHitsContainer}>
        {asideContent ? <aside className={styles.filterSection}>{asideContent}</aside> : null}
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
