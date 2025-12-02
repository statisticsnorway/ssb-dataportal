import { Label, Paragraph } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './text-field.module.css';

interface TextFieldProps {
  label: string;
  value: ReactNode;
}

export const TextField = ({ label, value }: TextFieldProps) => {
  return (
    <div className={styles.field}>
      <Label className={styles.label}>{label}</Label>
      <Paragraph data-size='lg' data-weight='medium'>
        {value}
      </Paragraph>
    </div>
  );
};
