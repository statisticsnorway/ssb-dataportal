import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { localization } from '@/libs/language';

export const metadata: Metadata = {
  title: 'Metadata catalog | Statistics Norway',
  description: 'Metadata catalog | Statistics Norway',
};

// Hardcoded until we implement multi-language support
localization.setLanguage('nb');

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
};

export default RootLayout;
