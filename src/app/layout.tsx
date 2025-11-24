import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { fetchAllClassifications } from '@/libs/data/classificationData';
import { Classification, ClassificationFamily } from '@/types/classification';
import { CLASSIFICATION_FAMILIES, KLASS_HOST } from '@/utils/constants';
import { KlassTabData } from '@/utils/klassTabContext';
import { MetadataProviders } from '@/utils/metadataProvider';
import { VardefTabData } from '@/utils/vardefTabContext';

export const metadata: Metadata = {
  title: 'Metadata services',
  description: 'SSB metadata services',
};

// Temp data for setting up prototype
const testVardefData: VardefTabData = {
  variableDefinitions: [
    {
      id: 'ux78',
      name: 'landbak',
      short_name: 'land',
      definition: 'bla bla',
      last_updated_at: '2025-10-11',
      valid_from: '1998-01-01',
      contains_special_categories_of_personal_data: false,
      contact: {
        title: 'Sjef',
        email: 'sjef@ssb.no',
      },
    },
    {
      id: 'icv6',
      name: 'buss',
      short_name: 'bus',
      definition: 'bla bla',
      last_updated_at: '2023-08-11',
      valid_from: '2000-01-01',
      contains_special_categories_of_personal_data: true,
      contact: {
        title: 'Professor',
        email: 'proff@ssb.no',
      },
    },
  ],
};

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
