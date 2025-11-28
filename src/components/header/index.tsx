'use client';

import { Heading, Link } from '@digdir/designsystemet-react';
import { FC } from 'react';
import styles from './header.module.scss';
import { HouseIcon } from '@navikt/aksel-icons';

export interface HeaderProps {
  homeUrl?: string;
}

export const Header: FC<HeaderProps> = ({ homeUrl }) => {
  return (
    <header className={styles.header}>
      <div className={`${styles.headerContainer} container`}>
        <Link href={homeUrl} title='Gå til hovedsiden' className={styles.logo}>
          <Heading level={1} data-size='xl' className={styles.logo}>
            <HouseIcon fontSize='5rem'/>
          </Heading>
        </Link>
        {/* TODO(): This could be section for user avatar. If not remove*/}
        <section className={styles.userSection}></section>
      </div>
    </header>
  );
};
