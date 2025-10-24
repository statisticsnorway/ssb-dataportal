
import { MetadataLayout } from '@/components/metadata-layout';
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
        <MetadataLayout
          displayFooter={true}
          backgroundColor='#ffffff'
          fontColor='#000000'
        >
          {children}
        </MetadataLayout>
      </body>
    </html>
  );
};

export default RootLayout;