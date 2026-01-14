import { Skeleton } from '@digdir/designsystemet-react';
import styles from './filter-skeleton.module.css';

export const FiltersSkeleton = () => (
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
);
