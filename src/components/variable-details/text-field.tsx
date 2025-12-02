import { Label, Paragraph } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './text-field.module.css';

interface TextFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
}

export const TextField = ({ label, value, className, ...rest }: TextFieldProps) => {
  return (
    <div className={`${styles.field} ${className ?? ''}`} {...rest}>
      <Label 
        className={styles.label}
      >
        {label}
      </Label>
      <Paragraph data-size='lg' data-weight='medium'>
        {value}
      </Paragraph>
    </div>
  );
};
