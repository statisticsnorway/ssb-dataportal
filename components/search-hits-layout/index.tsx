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
      <div className={styles.pageContainer}>
        <section className={styles.infoSection}>{infoContent}</section>
        <section className={styles.mainSection}>{mainContent}</section>
        <aside className={styles.filterSection}>{filterContent}</aside>
        {children}
      </div>
  );
};
