'use client';

import { HTMLAttributes, ReactNode } from 'react';
import styles from './search-hits-layout.module.css';

interface SearchHitsLayoutProps extends HTMLAttributes<HTMLDivElement> {
  infoContent?: ReactNode;
  mainContent?: ReactNode;
  filterContent?: ReactNode;
  children?: ReactNode;
}

export const SearchHitsLayout = ({ children, infoContent, mainContent, filterContent }: SearchHitsLayoutProps) => {

  return (
      <div className={`${styles.pageContainer} container`}>
        <section className={styles.infoSection}>{infoContent}</section>
        <section className={styles.searchHitsContainer}>
            <aside className={styles.filterSection}>{filterContent}</aside>
            <section className={styles.mainSection}>{mainContent}</section>
        </section>
        {children}
      </div>
  );
};
