import { ReactNode } from 'react';
import styles from './services.module.css';

export default async function ServicesLayout({ children }: { children: ReactNode }) {
  return <div className={styles.metadataContainer}>{children}</div>;
}
