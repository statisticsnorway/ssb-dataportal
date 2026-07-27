import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AppLayout } from '@/components/app-layout';
import { languageCookieName, localization, resolveLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import { openSans, roboto, robotoCondensed } from './fonts';
import './global.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { authenticateUser } from '@/libs/auth/userAuth';
import { AuthProvider } from './authContext';

const logger = createLogger('app:root');

export const generateMetadata = async (): Promise<Metadata> => {
  const cookieStore = await cookies();
  const language = resolveLanguage(cookieStore.get(languageCookieName)?.value);

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
  const cookieStore = await cookies();
  const language = resolveLanguage(cookieStore.get(languageCookieName)?.value);

  localization.setLanguage(language);

  logger.info(
    {
      language,
      useStaticData: process.env.VARDEF_USE_STATIC_DATA === 'true',
      nodeEnv: process.env.NODE_ENV,
    },
    'Application initializing',
  );

  const authResult = await authenticateUser();

  return (
    <AuthProvider isAuthenticated={authResult.isAuthenticated}>
      <html lang={language}>
        <body className={`${robotoCondensed.variable} ${roboto.variable} ${openSans.variable}`}>
          <NuqsAdapter>
            <AppLayout catalogTitle={localization.appTitle}>{children}</AppLayout>
          </NuqsAdapter>
        </body>
      </html>
    </AuthProvider>
  );
};

export default RootLayout;
