import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';

export const statuses = {
  draft: {
    label: `${localization.status.draft} (73)`,
    removeLabel: 'Fjern Utkast',
    totalHits: '3 treff',
  },
  internal: {
    label: `${localization.status.publishedInternal} (3)`,
    removeLabel: `${localization.status.publishedInternal}`,
    totalHits: '3 treff',
  },
  external: {
    label: `${localization.status.publishedExternal} (2)`,
    removeLabel: `${localization.status.publishedExternal}`,
    totalHits: '2 treff',
  },
  internalPlusExternal: {
    totalHits: '5 treff',
  },
};

const socialConditionsAndCrimeLabel = 'Sosiale forhold og kriminalitet';

export const variables = {
  socialConditionsAndCrime: `${socialConditionsAndCrimeLabel} (2)`,
  socialConditionsAndCrimeLabel,
  workAndPay: 'Arbeid og lønn (7)',
  health: {
    label: 'Helse (2)',
    tagLevelOne: 'Helse',
    tagLevelTwo: 'Helsetjenester',
  },
  healthRegion: 'Helseregion',
  population: 'Befolkning (25)',
  workAndPayPlusPopulationHits: '32 treff',
  bankingAndFinancialMarket: 'Bank og finansmarked (1)',
  companiesEnterprises: 'Bedrifter, foretak og regnskap (20)',
  totalHits: '78 treff',
};

export const spousesCountryBackgroundShortName = 'innv_ektef_landbak';
export const KNOWN_SHORT_NAME = 'org_form';
export const DETAIL_URL = `${tabsData.VariableDefinitions.route}/${KNOWN_SHORT_NAME}`;
export const CODELIST = 'Kodeliste';
export const STANDARD = 'Standard';

export const CLASSIFICATIONS_URL = 'classifications?types=Klassifikasjon';
export const REMOVE_STANDARD = 'Fjern Standard';
