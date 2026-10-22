import { localization } from '@/libs/language';
import styles from './result-count-label.module.css';

interface ResultCountLabelProps {
  count: number;
}

export const ResultCountLabel = ({ count }: Readonly<ResultCountLabelProps>) => (
  <>
    <span className={styles.desktopLabel}>
      {count === 0 ? localization.search.noHits : `${count} ${localization.search.hits}`}
    </span>
    <span className={styles.mobileLabel}>
      {localization.search.hitsCount}: {count}
    </span>
  </>
);
