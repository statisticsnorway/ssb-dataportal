import cn from 'classnames';
import { ReactNode } from 'react';
import { Footer } from '../footer';
import { Header } from '../header';

import '@global-css';

import { Alert } from '@digdir/designsystemet-react';
import { UrlItem } from '@/types/navigationTypes';
import ErrorBoundary from '../error-boundry';
import styles from './layout.module.css';

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
    name: 'metadata@ssb.no',
  },
];
export const AppLayout = ({
  children,
  className,
  fdkRegistrationBaseUrl,
  catalogTitle,
  displayFooter = true,
}: AppLayoutProps) => {
  return (
    <div className={cn(styles.layout, className)}>
      <Alert data-color={'info'} className={styles.infoAlert} data-size={'md'}>
        Velkommen til testing av datakatalogen. Du er nå i en prototype under utvikling.
      </Alert>
      <Header homeUrl='https://www.ssb.no' />
      <main className={styles.main}>
        {/* TODO(): Remove/change catalog-frontend props */}
        <ErrorBoundary fdkRegistrationBaseUrl={fdkRegistrationBaseUrl} title={catalogTitle ?? ''}>
          {children}
        </ErrorBoundary>
      </main>
      {displayFooter && <Footer footerLinks={footerLinks} />}
    </div>
  );
};
