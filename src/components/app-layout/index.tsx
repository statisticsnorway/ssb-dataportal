import cn from 'classnames';
import { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

import '@global-css';

import { Alert } from '@digdir/designsystemet-react';
import { UrlItem } from '@/types/navigationTypes';
import { getDevEnvironmentName } from '@/utils/functions';
import ErrorBoundary from '../error-boundry';

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
    <div className={cn(className)}>
      <Alert data-color={'info'} className='infoAlert' data-size={'md'}>
        Velkommen til testing av datakatalogen. Du er nå i en prototype under utvikling.
      </Alert>
      <Header homeUrl='https://www.ssb.no' devEnvironmentName={getDevEnvironmentName()} />
      <ErrorBoundary fdkRegistrationBaseUrl={fdkRegistrationBaseUrl} title={catalogTitle ?? ''}>
        {children}
      </ErrorBoundary>
      {displayFooter && <Footer footerLinks={footerLinks} />}
    </div>
  );
};
