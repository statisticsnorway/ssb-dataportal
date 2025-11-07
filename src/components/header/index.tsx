'use client'

import { FC } from 'react';
import styles from './header.module.scss';

export interface HeaderProps {
  homeUrl?: string;
}

export const Header: FC<HeaderProps> = ({
  homeUrl,
}) => {
  
  return (
      <header
        className={styles.header}
      >
        <div className={`${styles.headerContainer} container`}>
          <a
            href={homeUrl}
            title='Gå til hovedsiden'
            className={styles.logoText}
          >
            <p className={styles.logo}>Metadataportalen</p>
          </a>
        <section className={styles.userSection}>
        </section>

        </div>
      </header>
    );
  };

