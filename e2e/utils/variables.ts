import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';
import { ClassificationType } from '@/types/classification';

/** Matches the hit count text, e.g. "Antall treff: 12" without also matching "Antall treff: 123". */
export const hitsText = (count: number | string) => new RegExp(`Antall treff: ${count}(?!\\d)`);

export const statuses = {
  draft: {
    label: `${localization.status.draft} (73)`,
    removeLabel: 'Fjern Utkast',
    totalHits: hitsText(73),
  },
  internal: {
    label: `${localization.status.publishedInternal} (3)`,
    removeLabel: `${localization.status.publishedInternal}`,
    totalHits: hitsText(3),
  },
  external: {
    label: `${localization.status.publishedExternal} (2)`,
    removeLabel: `${localization.status.publishedExternal}`,
    totalHits: hitsText(2),
  },
  internalPlusExternal: {
    totalHits: hitsText(5),
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
  workAndPayPlusPopulationHits: hitsText(32),
  bankingAndFinancialMarket: 'Bank og finansmarked (1)',
  companiesEnterprises: 'Bedrifter, foretak og regnskap (20)',
  totalHits: hitsText(78),
};

export const spousesCountryBackgroundShortName = 'innv_ektef_landbak';
export const KNOWN_SHORT_NAME = 'org_form';
export const DETAIL_URL = `${tabsData.VariableDefinitions.route}/${KNOWN_SHORT_NAME}`;
export const CODELIST = 'Kodeliste';
export const STANDARD = 'Standard';

export const CLASSIFICATIONS_URL = `classifications?types=${ClassificationType.Classification}`;
export const REMOVE_STANDARD = 'Fjern Standard';

export const totalStandardMockClassifications = '10';
export const totalCodelistMockClassifications = '2';
export const languageButton = 'Language/Språk';
