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
      id: '0',
      name: {
        nb: 'Landbakgrunn',
        en: 'Country background',
      },
      patchId: 0,
      shortName: 'landbak',
      unitTypes: [],
      subjectFields: [],
      containsSpecialCategoriesOfPersonalData: false,
      validFrom: new Date('2000-01-01'),
      lastUpdatedAt: new Date('2025-10-11'),
      definition: {
        nb: 'Landbakgrunn er at...',
        en: 'Country background is...',
      },
      contact: {
        title: {
          nb: 'Professor',
          en: 'Professor',
        },
        email: 'proff@ssb.no',
      },
      owner: {
        team: 'test-team',
        groups: ['groups'],
      },
      createdAt: new Date('2000-01-01'),
      createdBy: 'test-user',
      lastUpdatedBy: 'test-user',
    },
    {
      id: 'icv6',
      name: {
        nb: 'Buss',
        en: 'Bus',
      },
      patchId: 0,
      shortName: 'bus',
      unitTypes: [],
      subjectFields: [],
      definition: {
        nb: 'Buss er at...',
        en: 'Bus is...',
      },
      validFrom: new Date('2020-01-01'),
      lastUpdatedAt: new Date('2025-10-11'),
      containsSpecialCategoriesOfPersonalData: false,
      contact: {
        title: {
          nb: 'Professor',
          en: 'Professor',
        },
        email: 'proff@ssb.no',
      },
      owner: {
        team: 'test-team',
        groups: ['groups'],
      },
      createdAt: new Date('2000-01-01'),
      createdBy: 'test-user',
      lastUpdatedBy: 'test-user',
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
