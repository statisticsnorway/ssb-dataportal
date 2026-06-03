import { Divider, Heading } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';
import { getVardefApiDocsUrl } from '@/utils/config';
import { getContactEmailAddress } from '@/utils/userAgent';
import { DataportalLogo } from '../dataportal-logo';
import { ApiDocLink } from '../link-components/apiDocLink';
import { ExternalLink } from '../link-components/externalLink';
import styles from './footer.module.css';

export const Footer = () => {
  const apiDocsUrl = getVardefApiDocsUrl();

  return (
    <div className={styles.footerWrapper}>
      <footer className={`${styles.footer} container`}>
        <div className={styles.footerTopRow}>
          <DataportalLogo title={localization.appTitle} placement='footer' negative />
        </div>
        <Divider className={styles.divider} />
        <div className={styles.footerMiddleRow}>
          <section className={styles.footerLinkSection}>
            <Heading level={3} className={`negative-text secondaryHeading`}>
              {localization.appTitle}
            </Heading>
            <p style={{ fontStyle: 'italic' }} className={'negative-text'}>
              {localization.info.landingPageSubTitle}
            </p>
          </section>
          <section className={styles.footerLinkSection}>
            <Heading level={3} className={`negative-text secondaryHeading`}>
              {localization.info.footerAboutPage}
            </Heading>
            <ExternalLink
              href='https://www.ssb.no/omssb/personvern/personvernerklaering'
              linkText={localization.info.footerPrivacyStatement}
              className={styles.negativeLink}
            />

            <p className={styles.negativeLink}>{localization.info.footerAccessibilityStatement}</p>

            <ApiDocLink href={apiDocsUrl} className={styles.negativeLink} />
          </section>
          <section className={styles.footerLinkSection}>
            <Heading level={3} className={`negative-text secondaryHeading`}>
              {localization.info.footerContact}
            </Heading>

            <ExternalLink
              linkText={String(getContactEmailAddress())}
              className={styles.negativeLink}
              href={`mailto:${getContactEmailAddress()}`}
            />

            <ExternalLink href='https://www.ssb.no' linkText='ssb.no' className={styles.negativeLink} />
          </section>
        </div>
      </footer>
    </div>
  );
};
