import { FC } from 'react';

import styles from './footer.module.css';
import MetadataLink from '../metadata-link';
import { UrlItem } from '@/types/navigationTypes';


export interface FooterProps {
  fontColor?: string;
  backgroundColor?: string;
  footerLinks?: UrlItem[];
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
            to={link.url}
            >
              {link.name}
          </MetadataLink>
      )) 
      }
    </section>
  </footer>
);

