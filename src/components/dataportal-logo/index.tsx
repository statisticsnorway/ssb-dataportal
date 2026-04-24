import { Link } from '@digdir/designsystemet-react';
import Image from 'next/image';
import { localization } from '@/libs/language';
import styles from './logo.module.css';

export interface LogoProps {
  homeUrl?: string;
  title?: string;
  negative?: boolean;
}

export const DataportalLogo = ({ homeUrl, title, negative }: LogoProps) => {
  const imageNameBase = process.env.USE_ANNIVERSARY_LOGO === 'true' ? 'ssb_logo_anniversary_no' : 'ssb_logo';
  const imageFile = negative ? `/${imageNameBase}_light.svg` : `/${imageNameBase}_dark.svg`;
  const textColor = negative ? `${styles.logoAndTitle} negative-text` : styles.logoAndTitle;
  return (
    <Link href={homeUrl} title={localization.navigateHome} className={textColor}>
      <Image
        className={styles.logo}
        src={imageFile}
        alt={`${localization.statisticsNorway} logo`}
        width={1435}
        height={929}
        sizes='(min-width: 768px) 248px, (max-width: 768px) 180px'
        priority
      />
      {title ? (
        <div className={textColor}>
          <div className={styles.verticalDivider} />
          <div className={styles.appTitle}>{title}</div>
        </div>
      ) : undefined}
    </Link>
  );
};
