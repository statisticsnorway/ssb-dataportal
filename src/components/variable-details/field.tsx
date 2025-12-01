import { Link, Paragraph } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './field.module.css';

interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  href?: string;
}

export const Field = ({ label, value, href, className, ...rest }: FieldProps) => {
  const content = href ? (
    <Link className={styles.value} data-size='md' target='_blank' href={href}>
      {value}
    </Link>
  ) : (
    <span className={styles.value}>
      {value}
    </span>
  );

  return (
    <div className={`${styles.field} ${className ?? ''}`} {...rest}>
      <dt className={styles.label}>
        {label}
      </dt>
      <Paragraph data-size='md'>
        {content}
      </Paragraph>
    </div>
  );
};


