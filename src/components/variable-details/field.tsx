import { Link } from '@digdir/designsystemet-react';
import styles from './field.module.css';

interface Props {
  label: string;
  value: string;
  href?: string;
}

export const Field = ({ label, value, href }: Props) => {
  return (
    <div className={styles.field}>
      <div className={styles.label}>
        {label}
      </div>
      {href ? (
        <Link className={styles.value} data-size='md' target='_blank' href={href}>
          {value}
        </Link>
      ) : (
        <div className={styles.value}>
          {value}
        </div>
      )}
    </div>
  );
};


