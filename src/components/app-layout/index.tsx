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
  fdkRegistrationBaseUrl?: string;
  fdkBaseUrl?: string;
  catalogTitle?: string;
}

const footerLinks: UrlItem[] = [
  {
    url: 'mailto:metadata@ssb.no',
    name: 'metadata@ssb.no',
  },
];
export const AppLayout = ({ children, fdkRegistrationBaseUrl, catalogTitle }: AppLayoutProps) => {
  return (
    <div className='rootContainer'>
      <Alert data-color={'info'} className='infoAlert' data-size={'md'}>
        Velkommen til testing av datakatalogen. Du er nå i en prototype under utvikling.
      </Alert>
      <Header homeUrl='/' devEnvironmentName={getDevEnvironmentName()} />
      <ErrorBoundary fdkRegistrationBaseUrl={fdkRegistrationBaseUrl} title={catalogTitle ?? ''}>
        {children}
      </ErrorBoundary>
      <Footer footerLinks={footerLinks} />
    </div>
  );
};
