import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { type FC } from 'react';
import { ClosableAlert } from '@/components/alerts';
import { ExternalLink } from '@/components/link-components/externalLink';
import { localization } from '@/libs/language';
import { tabsData } from './tabs';

const VariableDefinitionsBanner: FC = () => (
  <Alert data-color='info' role='status'>
    <Heading className='infoHeadingSecondary' level={2} data-size='sm' style={{ marginBottom: 'var(--ds-size-2)' }}>
      {localization.migrationVariableDefinitions.header}
    </Heading>
    <Paragraph>{localization.migrationVariableDefinitions.info}</Paragraph>
    <ExternalLink
      href='https://www.ssb.no/a/metadata/definisjoner/variabler/main.html'
      linkText={`${' '}${localization.migrationVariableDefinitions.linkText}`}
    />
  </Alert>
);

const DataProductsBanner: FC = () => (
  <Alert data-color='info' role='status'>
    <Heading level={2} className='infoHeadingSecondary'>
      {localization.info.datasetPrototypeIntro}
    </Heading>
    <Paragraph>{localization.info.datasetPrototypeInfo}</Paragraph>
  </Alert>
);

const ClassificationsBanner: FC = () => (
  <ClosableAlert
    heading={localization.migrationClassifications.header}
    message={localization.migrationClassifications.info}
  />
);

export const tabBanners: Record<string, FC> = {
  [tabsData.VariableDefinitions.id]: VariableDefinitionsBanner,
  [tabsData.DataProducts.id]: DataProductsBanner,
  [tabsData.Classifications.id]: ClassificationsBanner,
};
