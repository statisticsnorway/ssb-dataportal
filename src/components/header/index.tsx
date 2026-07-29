import { FC } from 'react';
import { DataportalLogo } from '../dataportal-logo';
import { LanguagePicker } from '../language-picker';
import { LoginButton } from '../login-button';
import styles from './header.module.css';

export interface HeaderProps {
  homeUrl?: string;
  title?: string;
  devEnvironmentName?: string;
}

export const Header: FC<HeaderProps> = ({ homeUrl, title, devEnvironmentName }) => {
  return (
    <div className={styles.headerWrapper}>
      <header className={`${styles.header} container`} role='banner'>
        <DataportalLogo homeUrl={homeUrl} title={title} placement='header' />
        <div className={styles.rightGroup}>
          {devEnvironmentName ? <p className={styles.environmentName}>{devEnvironmentName}</p> : undefined}
          <LanguagePicker />
          <LoginButton />
        </div>
      </header>
    </div>
  );
};
