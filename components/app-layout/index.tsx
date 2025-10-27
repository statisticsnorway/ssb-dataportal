import { ReactNode } from 'react';
import { Footer } from '../footer';
import { Header } from '../header';
import cn from 'classnames';

import '@global-css';

import style from './layout.module.css';
import ErrorBoundary from '../error-boundry';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  fontColor?: string;
  backgroundColor?: string;
  catalogAdminUrl?: string;
  fdkRegistrationBaseUrl?: string;
  adminGuiBaseUrl?: string;
  fdkBaseUrl?: string;
  termsOfUseUrl?: string;
  catalogTitle?: string;
  displayFooter?: boolean;
}

export const AppLayout = ({
  children,
  className,
  fontColor,
  backgroundColor,
  fdkRegistrationBaseUrl,
  catalogTitle,
  displayFooter = true,
}: AppLayoutProps) => {
  return (
    <div className={cn(style.layout, className)}>
      <Header
        homeUrl='/'
        fontColor={fontColor}
        backgroundColor={backgroundColor}
      />
      <main className={style.main}>
        <ErrorBoundary
          fdkRegistrationBaseUrl={fdkRegistrationBaseUrl}
          title={catalogTitle}
        >
          {children}
        </ErrorBoundary>
      </main>
      {displayFooter && (
        <Footer
          fontColor={fontColor}
          backgroundColor={backgroundColor}
        />
      )}
    </div>
  );
};
