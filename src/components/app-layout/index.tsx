import { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { getDevEnvironmentName } from '@/utils/functions';
import ErrorBoundary from '../error-boundary';

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
      <Header homeUrl='/' title={catalogTitle} devEnvironmentName={getDevEnvironmentName()} />
      <ErrorBoundary fdkRegistrationBaseUrl={fdkRegistrationBaseUrl} title={catalogTitle ?? ''}>
        {children}
      </ErrorBoundary>
      <Footer />
    </div>
  );
};
