'use client';

import { Alert, Card, Link } from '@digdir/designsystemet-react';
import { ExclamationmarkTriangleIcon, HouseIcon, InformationIcon } from '@navikt/aksel-icons';
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
          <HouseIcon aria-label='Hjem' fontSize='4rem' />
        </Link>
        <Alert data-color={'info'} className={styles.infoBox}>Velkommen til testing av datakatalogen. Du er nå i en prototype under utvikling.</Alert>
      </div>
    </header>
  );
};
