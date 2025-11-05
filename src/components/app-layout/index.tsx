import { ReactNode } from 'react';
import { Footer, MetadataLinkType } from '../footer';
import { Header } from '../header';
import cn from 'classnames';

import '@global-css';

import styles from './layout.module.css';
import ErrorBoundary from '../error-boundry';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  fdkRegistrationBaseUrl?: string;
  fdkBaseUrl?: string;
  catalogTitle?: string;
  displayFooter?: boolean;
}

const footerLinks: MetadataLinkType[] = [
  { 
    href: 'mailto:metadata@ssb.no', 
    text: 'metadata@ssb.no'
  },
];
export const AppLayout = ({
  children,
  className,
  fdkRegistrationBaseUrl,
  catalogTitle,
  displayFooter = true
}: AppLayoutProps) => {
  return (
    <div className={cn(styles.layout, className)}>
      <Header
        homeUrl='/'
      />
      <main className={styles.main}>
        <ErrorBoundary
          fdkRegistrationBaseUrl={fdkRegistrationBaseUrl}
          title={catalogTitle}
        >
          {children}
        </ErrorBoundary>
      </main>
      {displayFooter && (
        <Footer
          footerLinks={footerLinks}
        />
      )}
    </div>
  );
};
