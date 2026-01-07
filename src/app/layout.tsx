import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';

export const metadata: Metadata = {
  title: 'Metadata catalog | Statistics Norway',
  description: 'Metadata catalog | Statistics Norway',
};

/*
import { fetchClassificationFamilies } from '@/libs/data/classificationFamilyData';
import { testVardefData } from '@/utils/mock-data';

const classificationFamilies: ClassificationFamily[] = await fetchClassificationFamilies();

const allClassifications: Classification[] = await fetchAllClassifications();

const getMetadata = async () => {
  const klassData: KlassTabData = {
    klassClassificationFamilies: classificationFamilies,
    klassClassifications: allClassifications,
  };
  const vardefData: VardefTabData = testVardefData;
  return { klassData, vardefData };
};
*/
const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  //const { klassData, vardefData } = await getMetadata();
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
