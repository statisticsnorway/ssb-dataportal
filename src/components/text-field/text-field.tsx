import { ReactNode } from 'react';
import styles from './text-field.module.css';

interface TextFieldProps {
  label: string;
  value: ReactNode;
}

export const TextField = ({ label, value }: TextFieldProps) => (
  <div className={styles.fieldWrapper}>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
);
