import { Heading, Link } from '@digdir/designsystemet-react';
import { BookIcon, EnvelopeOpenIcon, HouseIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language';
import { getVardefApiDocsUrl } from '@/utils/config';
import { getContactEmailAddress } from '@/utils/userAgent';
import { ApiDocLink } from './api-doc-link';
import styles from './footer.module.css';
import { FooterLinkItem } from './footer-link-item';

export const Footer = () => {
  const apiDocsUrl = getVardefApiDocsUrl();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerWrapper} container`}>
        <section className={styles.footerLinkSection}>
          <Heading>{localization.appTitle}</Heading>
          <p>{localization.info.landingPageSubTitle}</p>
        </section>
        <section className={styles.footerLinkSection}>
          <Heading>Om nettstedet</Heading>
          <FooterLinkItem icon={<BookIcon title={localization.apiDocumentation} fontSize='2rem' />}>
            <ApiDocLink href={apiDocsUrl} />
          </FooterLinkItem>
          <FooterLinkItem icon={undefined}>
            <p>Tilgjengelighetserklæring (kommer)</p>
          </FooterLinkItem>
          <FooterLinkItem icon={undefined}>
            <p>Personvernerklæring (kommer)</p>
          </FooterLinkItem>
        </section>
        <section className={styles.footerLinkSection}>
          <Heading>Kom i kontakt</Heading>
          <FooterLinkItem icon={<EnvelopeOpenIcon title={localization?.contact?.label} fontSize='2rem' />}>
            <Link href={`mailto:${getContactEmailAddress()}`}>{getContactEmailAddress()}</Link>
          </FooterLinkItem>
          <FooterLinkItem icon={<HouseIcon title={localization?.contact?.label} fontSize='2rem' />}>
            <Link href='https://www.ssb.no'>ssb.no</Link>
          </FooterLinkItem>
        </section>
      </div>
    </footer>
  );
};
