import { Heading } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './layout-components.module.css';

interface InfoPanelProps extends HTMLAttributes<HTMLDListElement> {
  children: ReactNode;
  columns?: 1 | 2;
}

export const DetailsPagePanel = ({ children, columns = 1, className, ...rest }: InfoPanelProps) => {
  return (
    <dl 
      className={`${styles.panel} ${columns === 2 ? styles.gridTwoCol : ''} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </dl>
  );
};
