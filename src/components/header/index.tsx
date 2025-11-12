'use client'

import { FC } from 'react';
import styles from './header.module.scss';
import { Link } from '@digdir/designsystemet-react';

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
          <Link
            href={homeUrl}
            title='Gå til hovedsiden'
            className={styles.logo}
          >
            Metadataportalen
          </Link>
        <section className={styles.userSection}>
        </section>

        </div>
      </header>
    );
  };

