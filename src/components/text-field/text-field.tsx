import { Label, Link, Paragraph } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './text-field.module.css';

interface TextFieldProps {
  label: string;
  value: ReactNode;
  href?: string;
  longText?: boolean;
}

export const TextField = ({ label, value, href, longText }: TextFieldProps) => {
  return (
    <div className={styles.field}>
      <Label className={styles.label}>{label}</Label>
      {href ? (
        <Link className={styles.value} data-size='md' target='_blank' href={href}>
          Lenke
        </Link>
      ) : longText ? (
        <Paragraph data-size='lg'>{value}</Paragraph>
      ) : (
        <Label className={styles.value} data-size='lg'>
          {value}
        </Label>
      )}
    </div>
  );
};
