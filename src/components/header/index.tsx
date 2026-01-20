'use client';

import { Link } from '@digdir/designsystemet-react';
import Image from 'next/image';
import { FC } from 'react';
import styles from './header.module.css';

export interface HeaderProps {
  homeUrl?: string;
  devEnvironmentName?: string;
}

export const Header: FC<HeaderProps> = ({ homeUrl, devEnvironmentName }) => {
  return (
    <header className={styles.header}>
      <div className={`${styles.headerContainer} container`}>
        <Link href={homeUrl} title='Gå til hovedsiden' className={styles.logo}>
          <Image src='/ssb-logo.svg' alt='Statistics Norway logo' width={240} height={44} priority />
        </Link>
        <div className={`${styles.rightGroup}`}>
          {devEnvironmentName ? <p className={styles.environmentName}>{devEnvironmentName}</p> : undefined}
        </div>
      </div>
    </header>
  );
};
