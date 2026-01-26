import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { RuntimeConfigProvider } from '@/libs/config/runtime-config-context';
import { getPublicRuntimeConfig } from '@/libs/config/serverEnv';

export const metadata: Metadata = {
  title: 'Metadata catalog | Statistics Norway',
  description: 'Metadata catalog | Statistics Norway',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cfg = getPublicRuntimeConfig();
  return (
    <html lang='nb'>
      <body>
        <RuntimeConfigProvider value={cfg}>
          <AppLayout displayFooter={true} className='rootContainer'>
            {children}
          </AppLayout>
        </RuntimeConfigProvider>
      </body>
    </html>
  );
};

export default RootLayout;
