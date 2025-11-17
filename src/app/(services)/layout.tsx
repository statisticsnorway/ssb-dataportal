import { ReactNode } from 'react';
import SearchPage from '@/components/search-page/searchPage';
import styles from './services.module.css';

export default async function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.metadataContainer}>
      <SearchPage>{children}</SearchPage>
    </div>
  );
}
