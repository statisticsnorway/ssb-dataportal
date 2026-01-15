import { Link } from '@digdir/designsystemet-react';
import { FC } from 'react';
import { UrlItem } from '@/types/navigationTypes';
import styles from './footer.module.css';

export interface FooterProps {
  fontColor?: string;
  backgroundColor?: string;
  footerLinks?: UrlItem[];
}

export const Footer: FC<FooterProps> = ({ footerLinks }) => (
  <footer className={styles.footer}>
    <section className={styles.footerInfoSection}></section>
    <section className={styles.footerLinkSection}>
      {footerLinks?.map((link, index) => (
        <Link key={index} href={link.url}>
          {link.name}
        </Link>
      ))}
    </section>
  </footer>
);
