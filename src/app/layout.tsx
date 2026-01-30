import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { localization } from '@/libs/language';

// Hardcoded until we implement multi-language support
localization.setLanguage('nb');

export const metadata: Metadata = {
  title: `${localization.appTitle} | ${localization.statisticsNorway}`,
  description: `${localization.appTitle} | ${localization.statisticsNorway}`,
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <AppLayout catalogTitle={localization.appTitle}>{children}</AppLayout>
      </body>
    </html>
  );
};

export default RootLayout;
