import { Label, Link, Paragraph } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './field.module.css';

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
        <Link data-size='md' target='_blank' href={href}>
          {value}
        </Link>
      ) : (
        longText ? (
        <Label data-size='lg' data-weight='semibold'>
          {value}
        </Label>
        ) : (
        <Paragraph data-size='lg' data-weight='semibold'>
          {value}
        </Paragraph>
        )
      )}
    </div>
  );
};
