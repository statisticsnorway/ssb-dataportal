import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { fetchAllClassifications } from '@/libs/data/classificationData';
import { Classification, ClassificationFamily } from '@/types/classification';
import { CLASSIFICATION_FAMILIES, KLASS_HOST } from '@/utils/constants';
import { KlassTabData } from '@/utils/klassTabContext';
import { MetadataProviders } from '@/utils/metadataProvider';
import { VardefTabData } from '@/utils/vardefTabContext';
import { KlassReference, VariableStatus } from '@/libs/data-access/variable-definitions/internal';

export const metadata: Metadata = {
  title: 'Metadata services',
  description: 'SSB metadata services',
};

import { testVardefData } from '@/utils/mock-data';

const classificationFamilies: ClassificationFamily[] = await fetch(`${KLASS_HOST}${CLASSIFICATION_FAMILIES}`)
  .then((res) => res.json())
  .then((data) => data._embedded.classificationFamilies ?? []);

const allClassifications: Classification[] = await fetchAllClassifications();

const getMetadata = async () => {
  const klassData: KlassTabData = {
    klassClassificationFamilies: classificationFamilies,
    klassClassifications: allClassifications,
  };
  const vardefData: VardefTabData = testVardefData;
  return { klassData, vardefData };
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { klassData, vardefData } = await getMetadata();
  return (
    <html lang='nb'>
      <body>
        <AppLayout displayFooter={true} className='rootContainer'>
          <MetadataProviders klassData={klassData} vardefData={vardefData}>
            {children}
          </MetadataProviders>
        </AppLayout>
      </body>
    </html>
  );
};

export default RootLayout;
