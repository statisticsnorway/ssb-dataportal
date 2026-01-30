import { Metadata } from 'next';
import { Open_Sans, Roboto, Roboto_Condensed } from 'next/font/google';
import { AppLayout } from '@/components/app-layout';
import { localization } from '@/libs/language';

const openSans = Open_Sans({ subsets: ['latin-ext'] });
const roboto = Roboto({ subsets: ['latin-ext'] });
const robotoCondensed = Roboto_Condensed({ subsets: ['latin-ext'] });
// Hardcoded until we implement multi-language support
localization.setLanguage('nb');

export const metadata: Metadata = {
  title: `${localization.appTitle} | ${localization.statisticsNorway}`,
  description: `${localization.appTitle} | ${localization.statisticsNorway}`,
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang={localization.getLanguage()}
      className={`${robotoCondensed.className} ${roboto.className} ${openSans.className}`}
    >
      <body>
        <AppLayout catalogTitle={localization.appTitle}>{children}</AppLayout>
      </body>
    </html>
  );
};

export default RootLayout;
