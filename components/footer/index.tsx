import { FC } from 'react';

import styles from './footer.module.css';
import MetadataLink from '../metadata-link';

export type MetadataLinkType = {
  href: string;
  text: string;
}

export interface FooterProps {
  fontColor?: string;
  backgroundColor?: string;
  footerLinks?: MetadataLinkType[];
}

export const Footer: FC<FooterProps> = ({ footerLinks }) => (
  <footer
    className={styles.footer}
  >
    <section className={styles.footerInfoSection}>
      Bygget på Digitaliseringsdirektoratet Felles datakatalog
    </section>
    <section className={styles.footerLinkSection}>
      {footerLinks?.map((link, index) => (
          <MetadataLink
            key={index}
            to={link.href}
            >
              {link.text}
          </MetadataLink>
      )) 
      }
    </section>
  </footer>
);

