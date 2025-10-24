'use client';

import { FC } from 'react';
import styles from './header.module.scss';
import { ExternalLinkIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { Button, Divider, DropdownMenu } from '@digdir/designsystemet-react';
import { localization } from '@/lib/language/localization';

export interface HeaderProps {
  homeUrl?: string;
  adminGuiBaseUrl?: string;
  catalogAdminUrl?: string;
  fdkBaseUrl?: string;
  fdkRegistrationBaseUrl?: string;
  termsOfUseUrl?: string;
  useDemoLogo?: boolean;
  fontColor?: string;
  backgroundColor?: string;
}

const Header: FC<HeaderProps> = ({
  homeUrl,
  termsOfUseUrl,
  fontColor,
  backgroundColor,
}) => {
  const urls = [
    [
      {
        name: "SSB",
        url: "https://ssb.no",
        external: false,
      },
    ],
    [
      {
        name: localization.footer.privacyStatement,
        url: 'https://www.ssb.no/omssb/personvern',
        external: true,
      },
      {
        name: localization.footer.accessibility,
        url: 'https://www.ssb.no/diverse/tilgjengelighet',
        external: true,
      },
      {
        name: localization.header.contactUs,
        url: 'https://www.ssb.no/omssb/kontakt-oss',
        external: true,
      },
    ],
  ];

return (
    <header
      className={styles.header}
      style={{ color: fontColor ?? '#fff', background: backgroundColor ?? '#2d3741' }}
    >
      <div className={styles.headerContainer}>
        <a
          href={homeUrl}
          title='Gå til hovedsiden'
          className={styles.logoText}
        >
          <p className={styles.logo}>Metadataportalen</p>
        </a>
        <DropdownMenu size='small'>
          <DropdownMenu.Trigger asChild>
            <Button
              variant='tertiary'
              className={styles.menuButton}
            >
              <MenuHamburgerIcon
                aria-hidden
                fontSize='1.5rem'
              />
              {localization.header.menu}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {urls.map((group, index) => (
              <DropdownMenu.Group key={`menu-group-${index}`}>
                {group.map((urlObject, itemIndex) => (
                  <DropdownMenu.Item
                    key={`menu-item-${index}-${itemIndex}`}
                    className={styles.dropDownItem}
                    asChild
                  >
                    <a
                      href={urlObject.url}
                      className={styles.dropDownItem}
                      target={urlObject.external ? '_blank' : undefined}
                      rel={urlObject.external ? 'noreferrer' : undefined}
                    >
                      {urlObject.name}
                      {urlObject.external && (
                        <span className={styles.icon}>
                          <ExternalLinkIcon title='ExternalLinkIcon' />
                        </span>
                      )}
                    </a>
                  </DropdownMenu.Item>
                ))}
                <Divider />
              </DropdownMenu.Group>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </header>
  );
};

export { Header };
