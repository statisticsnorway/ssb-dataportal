import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { LocalizationSync } from '@/components/localization-sync';
import { localization } from '@/libs/language';
import { getRequestLanguage } from '@/libs/language/src/getRequestLanguage';
import { createLogger } from '@/libs/logger/server-logger';
import { openSans, roboto, robotoCondensed } from './fonts';
import './global.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { authenticateUser } from '@/libs/auth/userAuth';
import { AuthProvider } from './authContext';

const logger = createLogger('app:root');

logger.info(
  {
    useStaticData: process.env.VARDEF_USE_STATIC_DATA === 'true',
    nodeEnv: process.env.NODE_ENV,
  },
  'Application initializing',
);

export const generateMetadata = async (): Promise<Metadata> => {
  const language = await getRequestLanguage();

  localization.setLanguage(language);

  return {
    title: {
      template: `%s - ${localization.ssbDataportal}`,
      default: localization.ssbDataportal,
    },
    description: `${localization.appTitle} | ${localization.statisticsNorway}`,
  };
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const language = await getRequestLanguage();

  localization.setLanguage(language);

  const authResult = await authenticateUser();

  return (
    <AuthProvider isAuthenticated={authResult.isAuthenticated}>
      <html lang={language}>
        <body className={`${robotoCondensed.variable} ${roboto.variable} ${openSans.variable}`} data-color='secondary'>
          <LocalizationSync language={language}>
            <NuqsAdapter>
              <AppLayout catalogTitle={localization.appTitle}>{children}</AppLayout>
            </NuqsAdapter>
          </LocalizationSync>
        </body>
      </html>
    </AuthProvider>
  );
};

export default RootLayout;
