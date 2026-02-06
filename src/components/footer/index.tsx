import { Alert, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { FC } from 'react';
import { UrlItem } from '@/types/navigationTypes';
import { ExternalLink } from '../external-link';
import styles from './footer.module.css';

export interface FooterProps {
  fontColor?: string;
  backgroundColor?: string;
  footerLinks?: UrlItem[];
}

export const Footer: FC<FooterProps> = ({ footerLinks }) => (
  <footer className={`${styles.footer} container`}>
    <Alert data-color='info' className={styles.infoSection}>
      <Heading level={3}>Tilbakemeldinger</Heading>
      <Paragraph>
        Dataportalen er under utvikling, og dine innspill er viktige for oss. Hjelp oss gjerne ved å fylle ut
        <ExternalLink
          willOpenNewTab={true}
          linkText='tilbakemeldingsskjema for Dataportalen'
          href='https://forms.office.com/Pages/ResponsePage.aspx?id=knAhx0CyHU69YfqXupdcvG8mQNraR5ZAu3es4-se84xUN0VFME5BSVFSUTZDRUZCTzNTVUlFTDlUNC4u'
        />
      </Paragraph>
    </Alert>
    <section className={styles.footerLinkSection}>
      {footerLinks?.map((link, index) => (
        <Link key={index} href={link.url}>
          {link.name}
        </Link>
      ))}
    </section>
  </footer>
);
