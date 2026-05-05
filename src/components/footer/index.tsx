import { Divider, Heading, Link } from '@digdir/designsystemet-react';
import { BookIcon, EnvelopeOpenIcon, FigureIcon, HouseIcon, ShieldLockIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language';
import { getVardefApiDocsUrl } from '@/utils/config';
import { getContactEmailAddress } from '@/utils/userAgent';
import { DataportalLogo } from '../dataportal-logo';
import { ApiDocLink } from '../link-components/apiDocLink';
import { ExternalLink } from '../link-components/externalLink';
import styles from './footer.module.css';
import { FooterLinkItem } from './footer-link-item';

export const Footer = () => {
  const apiDocsUrl = getVardefApiDocsUrl();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTopRow}>
        <DataportalLogo title={localization.appTitle} placement='footer' negative />
      </div>
      <Divider className={styles.divider} />
      <div className={styles.footerMiddleRow}>
        <section className={styles.footerLinkSection}>
          <Heading level={3} className={'negative-text'}>
            {localization.appTitle}
          </Heading>
          <p style={{ fontStyle: 'italic' }} className={'negative-text'}>
            {localization.info.landingPageSubTitle}
          </p>
        </section>
        <section className={styles.footerLinkSection}>
          <Heading level={3} className={'negative-text'}>
            {localization.info.footerAboutPage}
          </Heading>
          <FooterLinkItem
            icon={
              <ShieldLockIcon title={localization?.contact?.label} fontSize='2rem' className={styles.negativeLink} />
            }
          >
            <ExternalLink
              href='https://www.ssb.no/omssb/personvern/personvernerklaering'
              linkText={localization.info.footerPrivacyStatement}
              className={styles.negativeLink}
            />
          </FooterLinkItem>
          <FooterLinkItem
            icon={<FigureIcon title={localization?.contact?.label} fontSize='2rem' className={styles.negativeLink} />}
          >
            <p className={styles.negativeLink}>{localization.info.footerAccessibilityStatement}</p>
          </FooterLinkItem>
          <FooterLinkItem
            icon={<BookIcon title={localization.apiDocumentation} fontSize='2rem' className={styles.negativeLink} />}
          >
            <ApiDocLink href={apiDocsUrl} className={styles.negativeLink} />
          </FooterLinkItem>
        </section>
        <section className={styles.footerLinkSection}>
          <Heading level={3} className={'negative-text'}>
            {localization.info.footerContact}
          </Heading>
          <FooterLinkItem
            icon={
              <EnvelopeOpenIcon title={localization?.contact?.label} fontSize='2rem' className={styles.negativeLink} />
            }
          >
            <Link className={styles.negativeLink} href={`mailto:${getContactEmailAddress()}`}>
              {getContactEmailAddress()}
            </Link>
          </FooterLinkItem>
          <FooterLinkItem
            icon={<HouseIcon title={localization?.contact?.label} fontSize='2rem' className={styles.negativeLink} />}
          >
            <ExternalLink href='https://www.ssb.no' linkText='ssb.no' className={styles.negativeLink} />
          </FooterLinkItem>
        </section>
      </div>
    </footer>
  );
};
