import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';

export const metadata: Metadata = {
  title: 'Metadata catalog | Statistics Norway',
  description: 'Metadata catalog | Statistics Norway',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='nb'>
      <body>
        <AppLayout displayFooter={true} className='rootContainer'>
          {children}
        </AppLayout>
      </body>
    </html>
  );
};

export default RootLayout;
