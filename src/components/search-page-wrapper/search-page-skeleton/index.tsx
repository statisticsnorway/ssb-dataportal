import { Skeleton } from '@digdir/designsystemet-react';
import styles from './search-page-skeleton.module.css';

interface SearchPageSkeletonProps {
  showFilters?: boolean;
  itemCount?: number;
}

export const SearchPageSkeleton = ({ showFilters = true, itemCount = 5 }: SearchPageSkeletonProps) => {
  return (
    <div className={`${styles.pageContainer} container`}>
      {/* Info Section Skeleton */}
      <section className={styles.infoSection}>
        <Skeleton variant='rectangle' width='100%' height={60} />
      </section>

      <section className={styles.searchHitsContainer}>
        {/* Filters Skeleton */}
        {showFilters && (
          <aside className={styles.filterSection}>
            {/* Filter Group 1 */}
            <div className={styles.filterGroup}>
              <Skeleton variant='text' width='60%' />
              <div className={styles.filterItems}>
                <Skeleton variant='rectangle' width='100%' height={20} />
                <Skeleton variant='rectangle' width='100%' height={20} />
                <Skeleton variant='rectangle' width='100%' height={20} />
                <Skeleton variant='rectangle' width='90%' height={20} />
              </div>
            </div>

            {/* Filter Group 2 */}
            <div className={styles.filterGroup}>
              <Skeleton variant='text' width='50%' />
              <div className={styles.filterItems}>
                <Skeleton variant='rectangle' width='100%' height={20} />
                <Skeleton variant='rectangle' width='95%' height={20} />
                <Skeleton variant='rectangle' width='85%' height={20} />
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Skeleton */}
        <section className={styles.mainSection}>
          {/* Hits and Sort Bar */}
          <div className={styles.hitsAndSort}>
            <Skeleton variant='text' width={80} />
            <Skeleton variant='rectangle' width={150} height={36} />
          </div>

          {/* Search Hit Cards */}
          <div className={styles.searchHitsList}>
            {Array.from({ length: itemCount }).map((_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <Skeleton variant='text' width='70%' height={28} />
                <div className={styles.cardContent}>
                  <Skeleton variant='text' width='100%' />
                  <Skeleton variant='text' width='100%' />
                  <Skeleton variant='text' width='80%' />
                </div>
                <div className={styles.cardFooter}>
                  <Skeleton variant='rounded' width={80} height={24} />
                  <Skeleton variant='rounded' width={80} height={24} />
                  <Skeleton variant='rounded' width={100} height={24} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className={styles.paginationSkeleton}>
            <Skeleton variant='rectangle' width={200} height={40} />
          </div>
        </section>
      </section>
    </div>
  );
};
