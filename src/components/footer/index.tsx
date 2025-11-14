import { FC } from 'react';

import styles from './footer.module.css';
import { UrlItem } from '@/types/navigationTypes';
import { Link } from '@digdir/designsystemet-react';


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
          <Link
            key={index}
            href={link.url}
            >
              {link.name}
          </Link>
      )) 
      }
    </section>
  </footer>
);

