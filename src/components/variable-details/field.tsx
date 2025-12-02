import { Label, Link } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './field.module.css';

interface FieldProps {
  label: string;
  value: ReactNode;
  href?: string;
}

export const Field = ({ label, value, href }: FieldProps) => {
  return (
    <div className={styles.field}>
      <Label className={styles.label}>{label}</Label>
      {href ? (
        <Link data-size='md' target='_blank' href={href}>
          {value}
        </Link>
      ) : (
        <Label data-size='lg' data-weight='semibold'>
          {value}
        </Label>
      )}
    </div>
  );
};
