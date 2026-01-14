import { Skeleton } from '@digdir/designsystemet-react';
import styles from './search-hit-card-skeleton.module.css';

export const SearchHitCardSkeleton = () => (
  <div className={styles.skeletonCard}>
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
);
