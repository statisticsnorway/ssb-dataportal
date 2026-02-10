import { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

import '@global-css';

import { Alert } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';
import { getDevEnvironmentName } from '@/utils/functions';
import ErrorBoundary from '../error-boundry';

interface AppLayoutProps {
  children: ReactNode;
  fdkRegistrationBaseUrl?: string;
  fdkBaseUrl?: string;
  catalogTitle?: string;
  className?: string;
}

export const AppLayout = ({ children, fdkRegistrationBaseUrl, catalogTitle }: AppLayoutProps) => {
  return (
    <div className='rootContainer'>
      <Alert data-color={'info'} className='infoAlert' data-size={'md'}>
        {localization.welcomeToTesting}
      </Alert>
      <Header homeUrl='/' title={catalogTitle} devEnvironmentName={getDevEnvironmentName()} />
      <ErrorBoundary fdkRegistrationBaseUrl={fdkRegistrationBaseUrl} title={catalogTitle ?? ''}>
        {children}
      </ErrorBoundary>
      <Footer />
    </div>
  );
};
