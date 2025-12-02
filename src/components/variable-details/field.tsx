import { Label, Link } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './field.module.css';

interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  href?: string;
}

export const Field = ({ label, value, href, className, ...rest }: FieldProps) => {
  return (
    <div className={`${styles.field} ${className ?? ''}`} {...rest}>
      <Label 
        className={styles.label}
      >
        {label}
      </Label>
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


