import { FC } from 'react';

import styles from './footer.module.css';
import Link from 'next/link';

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
          <Link
            key={index}
            href={link.href}
            >
              {link.text}
          </Link>
      )) 
      }
    </section>
  </footer>
);

