import { FC } from 'react';
import { DataportalLogo } from '../dataportal-logo';
import { LoginButton } from '../login-button';
import styles from './header.module.css';

export interface HeaderProps {
  homeUrl?: string;
  title?: string;
  devEnvironmentName?: string;
}

export const Header: FC<HeaderProps> = ({ homeUrl, title, devEnvironmentName }) => {
  return (
    <header className={`${styles.header}`} role='banner'>
      <DataportalLogo homeUrl={homeUrl} title={title} />
      <div className={styles.rightGroup}>
        {devEnvironmentName ? <p className={styles.environmentName}>{devEnvironmentName}</p> : undefined}
      </div>
      <LoginButton />
    </header>
  );
};
