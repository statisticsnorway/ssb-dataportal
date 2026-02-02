import { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

import '@global-css';

import { Alert } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';
import { UrlItem } from '@/types/navigationTypes';
import { getDevEnvironmentName } from '@/utils/functions';
import ErrorBoundary from '../error-boundry';

interface AppLayoutProps {
  children: ReactNode;
  fdkRegistrationBaseUrl?: string;
  fdkBaseUrl?: string;
  catalogTitle?: string;
  className?: string;
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
      {/*TODO: Remove Alert when transistioning from prototype to product
        The element overflows page under around 354px, but it should not be fixed since we are going to remove the alert*/}
      <Alert data-color={'info'} className='infoAlert' data-size={'md'}>
        {localization.welcomeToTesting}
      </Alert>
      <Header homeUrl='/' title={catalogTitle} devEnvironmentName={getDevEnvironmentName()} />
      <ErrorBoundary fdkRegistrationBaseUrl={fdkRegistrationBaseUrl} title={catalogTitle ?? ''}>
        {children}
      </ErrorBoundary>
      <Footer footerLinks={footerLinks} />
    </div>
  );
};
