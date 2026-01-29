'use client';

import { Link } from '@digdir/designsystemet-react';
import Image from 'next/image';
import { FC } from 'react';
import { localization } from '@/libs/language';
import styles from './header.module.css';

export interface HeaderProps {
  homeUrl?: string;
  title?: string;
  devEnvironmentName?: string;
}

export const Header: FC<HeaderProps> = ({ homeUrl, title, devEnvironmentName }) => {
  return (
    <header className={styles.header}>
      <div className={`${styles.headerContainer} container`}>
        <Link href={homeUrl} title={localization.navigateHome} className={styles.logoAndTitle}>
          <Image src='/ssb-logo.svg' alt={`${localization.statisticsNorway} logo`} width={240} height={44} priority />
          {title ? (
            <div className={styles.logoAndTitle}>
              <div className={styles.verticalDivider} />
              <div className={styles.appTitle}>{title}</div>
            </div>
          ) : undefined}
        </Link>
        <div className={`${styles.rightGroup}`}>
          {devEnvironmentName ? <p className={styles.environmentName}>{devEnvironmentName}</p> : undefined}
        </div>
      </div>
    </header>
  );
};
