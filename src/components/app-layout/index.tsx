import { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { getDevEnvironmentName } from '@/utils/functions';
import { FeedbackCallout } from '../feedback-callout';

interface AppLayoutProps {
  children: ReactNode;
  catalogTitle?: string;
}

export const AppLayout = ({ children, catalogTitle }: AppLayoutProps) => {
  return (
    <div className='rootContainer'>
      <Header homeUrl='/' title={catalogTitle} devEnvironmentName={getDevEnvironmentName()} />
      <div style={{ flex: '1' }}>{children}</div>
      <FeedbackCallout />
      <Footer />
    </div>
  );
};
