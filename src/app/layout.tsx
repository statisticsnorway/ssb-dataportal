import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { localization } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import { openSans, roboto, robotoCondensed } from './fonts';
import './global.css';

const logger = createLogger('app:root');

// Hardcoded until we implement multi-language support
localization.setLanguage('nb');

logger.info(
  {
    language: localization.getLanguage(),
    useStaticData: process.env.VARDEF_USE_STATIC_DATA === 'true',
    nodeEnv: process.env.NODE_ENV,
  },
  'Application initializing',
);

export const metadata: Metadata = {
  title: `${localization.appTitle} | ${localization.statisticsNorway}`,
  description: `${localization.appTitle} | ${localization.statisticsNorway}`,
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body className={`${robotoCondensed.variable} ${roboto.variable} ${openSans.variable}`}>
        <AppLayout catalogTitle={localization.appTitle}>{children}</AppLayout>
      </body>
    </html>
  );
};

export default RootLayout;
