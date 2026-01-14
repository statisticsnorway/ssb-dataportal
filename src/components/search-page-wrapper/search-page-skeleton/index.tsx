import { Skeleton } from '@digdir/designsystemet-react';
import { FiltersSkeleton } from '../filter-skeleton';
import { SearchHitCardSkeleton } from '../search-hit-card-skeleton';
import styles from './search-page-skeleton.module.css';

interface SearchPageSkeletonProps {
  showFilters?: boolean;
  itemCount?: number;
}

export const SearchPageSkeleton = ({ showFilters = true, itemCount = 5 }: SearchPageSkeletonProps) => (
  <div className={`${styles.pageContainer} container`}>
    <section className={styles.infoSection}>
      <Skeleton variant='rectangle' width='100%' height={60} />
    </section>

    <section className={styles.searchHitsContainer}>
      {showFilters && <FiltersSkeleton />}

      <section className={styles.mainSection}>
        <div className={styles.hitsAndSort}>
          <Skeleton variant='text' width={80} />
          <Skeleton variant='rectangle' width={150} height={36} />
        </div>

        <div className={styles.searchHitsList}>
          {Array.from({ length: itemCount }).map((_, index) => (
            <SearchHitCardSkeleton key={index} />
          ))}
        </div>

        <div className={styles.paginationSkeleton}>
          <Skeleton variant='rectangle' width={200} height={40} />
        </div>
      </section>
    </section>
  </div>
);
