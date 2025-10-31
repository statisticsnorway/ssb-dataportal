
import { AppLayout } from '@/components/app-layout';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Metadata services',
  description: 'SSB metadata services',
};

const RootLayout = async ({ children }: { children: React.ReactNode }
) => {

  return (
    <html lang='nb'>
      <body>
        <AppLayout
          displayFooter={true}
          className="container"
        >
          {children}
        </AppLayout>
      </body>
    </html>
  );
};

export default RootLayout;