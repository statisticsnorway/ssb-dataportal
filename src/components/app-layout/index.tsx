import { ReactNode } from 'react';
import { Footer} from '../footer';
import { Header } from '../header';
import cn from 'classnames';

import '@global-css';

import styles from './layout.module.css';
import ErrorBoundary from '../error-boundry';
import { UrlItem } from '@/types/navigationTypes';
import { localization } from '@/utils/src';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  fdkRegistrationBaseUrl?: string;
  fdkBaseUrl?: string;
  catalogTitle?: string;
  displayFooter?: boolean;
}

const footerLinks: UrlItem[] = [
  { 
    url: 'mailto:metadata@ssb.no', 
    name: 'metadata@ssb.no'
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
