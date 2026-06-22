import { Divider, Heading } from '@statisticsnorway/design-react';
import { ACCESSIBILITY_STATEMENT_URL, PRIVACY_STATEMENT_URL } from '@/config/constants';
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
              href={PRIVACY_STATEMENT_URL}
              linkText={localization.info.footerPrivacyStatement}
              className={styles.negativeLink}
            />
            <ExternalLink
              href={ACCESSIBILITY_STATEMENT_URL}
              linkText={localization.info.footerAccessibilityStatement}
              className={styles.negativeLink}
            />
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
