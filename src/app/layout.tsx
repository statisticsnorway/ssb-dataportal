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

const befolkning: KlassReference = { title: 'Befolkning', code: 'be', referenceUri: '' };
const transport: KlassReference = { title: 'Transport', code: 'tr', referenceUri: '' };
// Just created to verify that it's filtered out
const nullable: KlassReference = { title: null, code: null, referenceUri: '' };

// Temp data for setting up prototype
const testVardefData: VardefTabData = {
  variableDefinitions: [
    {
      id: '0',
      name: 'Landbakgrunn',
      patchId: 0,
      shortName: 'landbak',
      unitTypes: [],
      subjectFields: [befolkning, transport, nullable],
      containsSpecialCategoriesOfPersonalData: false,
      variableStatus: VariableStatus.Draft,
      validFrom: new Date('2000-01-01'),
      lastUpdatedAt: new Date('2025-10-11'),
      definition:
        'For personer født i utlandet, er dette (med noen få unntak) eget fødeland. For personer født i Norge er det foreldrenes fødeland. I de tilfeller der foreldrene har ulikt fødeland, er det morens fødeland som blir valgt. Hvis ikke personen selv eller noen av foreldrene er utenlandsfødt, hentes landbakgrunn fra de første utenlandsfødte en treffer på i rekkefølgen mormor, morfar, farmor eller farfar.',
      contact: {
        title: 'Professor',
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
      name: 'Buss',
      patchId: 0,
      shortName: 'bus',
      unitTypes: [],
      subjectFields: [transport],
      definition: 'En buss er en bil for persontransport med over 8 sitteplasser i tillegg til førersetet.',
      validFrom: new Date('2020-01-01'),
      lastUpdatedAt: new Date('2025-10-11'),
      containsSpecialCategoriesOfPersonalData: false,
      variableStatus: VariableStatus.Draft,
      contact: {
        title: 'Professor',
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
