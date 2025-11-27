import { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { fetchAllClassifications } from '@/libs/data/classificationData';
import { Classification, ClassificationFamily } from '@/types/classification';
import { CLASSIFICATION_FAMILIES, KLASS_HOST } from '@/utils/constants';
import { KlassTabData } from '@/utils/klassTabContext';
import { MetadataProviders } from '@/utils/metadataProvider';
import { VardefTabData } from '@/utils/vardefTabContext';
import { ReferenceItem } from '../types/variableDefinition';

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
      definition:
        'For personer født i utlandet, er dette (med noen få unntak) eget fødeland. For personer født i Norge er det foreldrenes fødeland. I de tilfeller der foreldrene har ulikt fødeland, er det morens fødeland som blir valgt. Hvis ikke personen selv eller noen av foreldrene er utenlandsfødt, hentes landbakgrunn fra de første utenlandsfødte en treffer på i rekkefølgen mormor, morfar, farmor eller farfar.',
      last_updated_at: '2025-10-11',
      valid_from: '1998-01-01',
      subject_fields: [
        { title: 'Befolkning', code: 'be', reference_uri: 'https://www.test.ssb.no/klass/klassifikasjoner/618' },
        {
          title: 'Transport og reiseliv',
          code: 'tr',
          reference_uri: 'https://www.test.ssb.no/klass/klassifikasjoner/618',
        },
      ],
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
      definition: 'En buss er en bil for persontransport med over 8 sitteplasser i tillegg til førersetet.',
      last_updated_at: '2023-08-11',
      valid_from: '2000-01-01',
      subject_fields: [
        {
          title: 'Transport og reiseliv',
          code: 'tr',
          reference_uri: 'https://www.test.ssb.no/klass/klassifikasjoner/618',
        },
      ],
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
