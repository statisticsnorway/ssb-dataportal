'use client';

import { Link } from '@digdir/designsystemet-react';
import Image from 'next/image';
import { FC } from 'react';
import styles from './header.module.css';

export interface HeaderProps {
  homeUrl?: string;
}

export const Header: FC<HeaderProps> = ({ homeUrl }) => {
  return (
    <header className={styles.header}>
      <div className={`${styles.headerContainer} container`}>
        <Link href={homeUrl} title='Gå til hovedsiden' className={styles.logo}>
          <Image src='/ssb-logo.svg' alt='Statistics Norway logo' width={240} height={44} priority />
        </Link>
        <div className={`${styles.rightGroup}`}>
          {process.env.NEXT_PUBLIC_ENVIRONMENT_NAME ? (
            <p className={styles.environmentName}>{process.env.NEXT_PUBLIC_ENVIRONMENT_NAME}</p>
          ) : undefined}
        </div>
      </div>
    </header>
  );
};
