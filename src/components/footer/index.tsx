import { Heading, Link } from '@digdir/designsystemet-react';
import { BookIcon, EnvelopeOpenIcon, FigureIcon, HouseIcon, ShieldLockIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language';
import { getVardefApiDocsUrl } from '@/utils/config';
import { getContactEmailAddress } from '@/utils/userAgent';
import { ExternalLink } from '../link-components/externalLink';
import { ApiDocLink } from './authApiLink';
import styles from './footer.module.css';
import { FooterLinkItem } from './footer-link-item';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <section className={styles.footerLinkSection}>
        <Heading>{localization.appTitle}</Heading>
        <p>{localization.info.landingPageSubTitle}</p>
      </section>
      <section className={styles.footerLinkSection}>
        <Heading>{localization.info.footerAboutPage}</Heading>
        <FooterLinkItem icon={<ShieldLockIcon title={localization?.contact?.label} fontSize='2rem' />}>
          <ExternalLink
            href='https://www.ssb.no/omssb/personvern/personvernerklaering'
            linkText={localization.info.footerPrivacyStatement}
          />
        </FooterLinkItem>
        <FooterLinkItem icon={<FigureIcon title={localization?.contact?.label} fontSize='2rem' />}>
          <p>{localization.info.footerAccessibilityStatement}</p>
        </FooterLinkItem>
        <FooterLinkItem icon={<BookIcon title={localization.apiDocumentation} fontSize='2rem' />}>
          <ApiDocLink href={getVardefApiDocsUrl()} />
        </FooterLinkItem>
      </section>
      <section className={styles.footerLinkSection}>
        <Heading>{localization.info.footerContact}</Heading>
        <FooterLinkItem icon={<EnvelopeOpenIcon title={localization?.contact?.label} fontSize='2rem' />}>
          <Link href={`mailto:${getContactEmailAddress()}`}>{getContactEmailAddress()}</Link>
        </FooterLinkItem>
        <FooterLinkItem icon={<HouseIcon title={localization?.contact?.label} fontSize='2rem' />}>
          <ExternalLink href='https://www.ssb.no' linkText='ssb.no' />
        </FooterLinkItem>
      </section>
    </footer>
  );
};
