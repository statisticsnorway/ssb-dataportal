import { Heading, Link } from '@digdir/designsystemet-react';
import styles from './field.module.css';

interface Props {
  label: string;
  value: string;
}

export const LinkField = ({ label, value }: Props) => {
  return (
    <div className={styles['info-block-container']}>
      <div className={styles['info-block-item']}>
        <Heading level={3} data-size='xl' className={styles.label}>
          {label}
        </Heading>
        <Link data-size='md' href={value}>
          Lenke
        </Link>
      </div>
    </div>
  );
};
