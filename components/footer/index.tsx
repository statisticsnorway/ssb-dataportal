import { FC } from 'react';

import styles from './footer.module.css';
import EmailIcon from './images/email.svg';
import MetadataLink from '../link';
import { localization } from '@/lib/language/localization';

export interface FooterProps {
  /**
   * font color
   * @type {string}
   */
  fontColor?: string;
  /**
   * background color
   * @type {string}
   */
  backgroundColor?: string;
}

export const Footer: FC<FooterProps> = ({ fontColor, backgroundColor }) => (
  <footer
    className={styles.footer}
    style={{ ...(fontColor ? { color: fontColor } : {}), ...(backgroundColor ? { background: backgroundColor } : {}) }}
  >
    <div className={styles.content}>
      <div className={styles.column}>Bygget på Digitaliseringsdirektoratet Felles datakatalog</div>
      <div className={styles.column}>
        <MetadataLink
          href='https://www.digdir.no/om-oss/personvernerklaering/706'
          external={true}
        >
          {localization.footer.privacyStatement}
        </MetadataLink>
        <MetadataLink
          href='https://www.digdir.no/om-oss/informasjonskapsler/707'
          external={true}
        >
          {localization.footer.cookies}
        </MetadataLink>
        <MetadataLink
          href='https://uustatus.no/nb/erklaringer/publisert/8020b962-b706-4cdf-ab8b-cdb5f480a696'
          external={true}
        >
          {localization.footer.accessibility}
        </MetadataLink>
      </div>
      <div className={styles.column}>
        <MetadataLink
          href='mailto:metadata@ssb.no'
          icon={<EmailIcon />}
        >
          metadata@ssb.no
        </MetadataLink>
      </div>
    </div>
  </footer>
);

export default Footer;
