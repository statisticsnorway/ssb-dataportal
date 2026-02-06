import { Card, Link, Paragraph } from '@digdir/designsystemet-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { FC } from 'react';
import { ExternalLink } from '@/components/external-link';
import PencilIcon from '@/icons/pencil.svg';
import { localization } from '@/libs/language';
import { UrlItem } from '@/types/navigationTypes';
import styles from './footer.module.css';

export interface FooterProps {
  fontColor?: string;
  backgroundColor?: string;
  footerLinks?: UrlItem[];
}

export const Footer: FC<FooterProps> = () => (
  <footer className={styles.footer}>
    <div className={`${styles.footerWrapper} container`}>
      <Card className={styles.infoSection}>
        <PencilIcon width={'60px'} />
        <Paragraph>
          Dataportalen er under utvikling, og dine innspill er viktige for oss. Hjelp oss gjerne ved å fylle ut{' '}
          <ExternalLink
            willOpenNewTab={true}
            linkText={localization.feedBackForm}
            href='https://forms.office.com/Pages/ResponsePage.aspx?id=knAhx0CyHU69YfqXupdcvG8mQNraR5ZAu3es4-se84xUN0VFME5BSVFSUTZDRUZCTzNTVUlFTDlUNC4u'
          />
        </Paragraph>
      </Card>
      <section className={styles.footerLinkSection}>
        <EnvelopeOpenIcon title={localization.contact.label} fontSize='2rem' />
        <Link href='mailto:metadata@ssb.no'>metadata@ssb.no</Link>
      </section>
    </div>
  </footer>
);
