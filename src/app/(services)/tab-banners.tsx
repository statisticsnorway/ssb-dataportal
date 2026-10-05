import { type FC } from 'react';
import { ClosableAlert } from '@/components/alerts';
import { ExternalLink } from '@/components/link-components/externalLink';
import {
  datasetPrototypeBannerDismissedCookieName,
  localization,
  migrationClassificationsBannerDismissedCookieName,
  migrationVariableDefinitionsBannerDismissedCookieName,
} from '@/libs/language';
import { tabsData } from './tabs';

const VariableDefinitionsBanner: FC = () => (
  <ClosableAlert
    heading={localization.migrationVariableDefinitions.header}
    message={localization.migrationVariableDefinitions.info}
    extraContent={
      <ExternalLink
        href='https://www.ssb.no/a/metadata/definisjoner/variabler/main.html'
        linkText={`${' '}${localization.migrationVariableDefinitions.linkText}`}
      />
    }
    persistDismissalCookieName={migrationVariableDefinitionsBannerDismissedCookieName}
  />
);

const DataProductsBanner: FC = () => (
  <ClosableAlert
    heading={localization.info.datasetPrototypeIntro}
    message={localization.info.datasetPrototypeInfo}
    persistDismissalCookieName={datasetPrototypeBannerDismissedCookieName}
  />
);

const ClassificationsBanner: FC = () => (
  <ClosableAlert
    heading={localization.migrationClassifications.header}
    message={localization.migrationClassifications.info}
    persistDismissalCookieName={migrationClassificationsBannerDismissedCookieName}
  />
);

export const tabBanners: Record<string, FC> = {
  [tabsData.VariableDefinitions.id]: VariableDefinitionsBanner,
  [tabsData.DataProducts.id]: DataProductsBanner,
  [tabsData.Classifications.id]: ClassificationsBanner,
};
