import { FC } from 'react';

import styles from './footer.module.css';
import Link from 'next/link';

export interface FooterProps {
  fontColor?: string;
  backgroundColor?: string;
}

export const Footer: FC<FooterProps> = ({ fontColor, backgroundColor }) => (
  <footer
    className={styles.footer}
  >
    <section className={styles.footerInfoSection}>
      Bygget på Digitaliseringsdirektoratet Felles datakatalog
    </section>
    <section className={styles.footerLinkSection}>
      <Link
        href='mailto:metadata@ssb.no'>
          metadata@ssb.no
      </Link>
    </section>
  </footer>
);

