import { Link } from '@digdir/designsystemet-react';
import Image from 'next/image';
import { localization } from '@/libs/language';
import styles from './logo.module.css';

export interface LogoProps {
  homeUrl?: string;
  title?: string;
  negative?: boolean;
  placement?: string;
}

export const DataportalLogo = ({ homeUrl, title, negative, placement }: LogoProps) => {
  const imageNameBase = process.env.USE_ANNIVERSARY_LOGO === 'true' ? 'ssb_logo_anniversary_no' : 'ssb_logo';
  const imageFile = negative ? `/${imageNameBase}_light.svg` : `/${imageNameBase}_dark.svg`;
  const textColor = negative ? `${styles.logoAndTitle} negative-text` : styles.logoAndTitle;
  return homeUrl ? (
    <Link href={homeUrl} title={localization.navigateHome} className={textColor}>
      <Image
        className={styles.logo}
        src={imageFile}
        alt={`${localization.statisticsNorway} ${placement} logo`}
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
  ) : (
    <div className={textColor}>
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
    </div>
  );
};

/*
return homeUrl ? (
  <Link href={homeUrl} title={localization.navigateHome} className={textColor}>
    <Image
      className={styles.logo}
      src={imageFile}
      alt={`${localization.statisticsNorway} logo`}
      width={1435}
      height={929}
      sizes="(min-width: 768px) 248px, (max-width: 768px) 180px"
      priority
    />
    {title ? (
      <div className={textColor}>
        <div className={styles.verticalDivider} />
        <div className={styles.appTitle}>{title}</div>
      </div>
    ) : null}
  </Link>
) : (
  <div className={textColor}>
    <Image
      className={styles.logo}
      src={imageFile}
      alt={`${localization.statisticsNorway} logo`}
      width={1435}
      height={929}
      sizes="(min-width: 768px) 248px, (max-width: 768px) 180px"
      priority
    />
    {title ? (
      <div className={textColor}>
        <div className={styles.verticalDivider} />
        <div className={styles.appTitle}>{title}</div>
      </div>
    ) : null}
  </div>
);
*/
