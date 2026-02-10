import { Card, Link, Paragraph } from '@digdir/designsystemet-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { ExternalLink } from '@/components/external-link';
import { localization } from '@/libs/language';
import styles from './footer.module.css';

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={`${styles.footerWrapper} container`}>
      <Card className={styles.infoSection}>
        <img src={'/pencil.svg'} alt='' width={50} className={styles.iconImage} />
        <Paragraph>
          Dataportalen er under utvikling, og dine innspill er viktige for oss. Hjelp oss gjerne ved å fylle ut{' '}
          <ExternalLink
            linkText={localization.feedBackForm}
            href='https://forms.office.com/Pages/ResponsePage.aspx?id=knAhx0CyHU69YfqXupdcvG8mQNraR5ZAu3es4-se84xUN0VFME5BSVFSUTZDRUZCTzNTVUlFTDlUNC4u'
          />
        </Paragraph>
      </Card>
      <section className={styles.footerLinkSection}>
        <EnvelopeOpenIcon title={localization?.contact?.label} fontSize='2rem' />
        <Link href='mailto:metadata@ssb.no'>metadata@ssb.no</Link>
      </section>
    </div>
  </footer>
);
