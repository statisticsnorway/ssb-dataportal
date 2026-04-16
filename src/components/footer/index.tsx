import { Card, Link, Paragraph } from '@digdir/designsystemet-react';
import { BookIcon, EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { ExternalLink } from '@/components/external-link';
import { localization } from '@/libs/language';
import { getContactEmailAddress } from '@/utils/userAgent';
import { ApiDocLink } from './api-doc-link';
import styles from './footer.module.css';

export const Footer = () => {
  const apiDocsUrl = process.env.VARDEF_API_DOCS_URL ?? 'https://metadata.ssb.no/docs/swagger/variable-definitions';

  return (
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
          <Link href={`mailto:${getContactEmailAddress()}`}>{getContactEmailAddress()}</Link>
        </section>
        <section className={styles.footerLinkSection}>
          <BookIcon title={localization.apiDocumentation} fontSize='2rem' />
          <ApiDocLink href={apiDocsUrl} />
        </section>
      </div>
    </footer>
  );
};
