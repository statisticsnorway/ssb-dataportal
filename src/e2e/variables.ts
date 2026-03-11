import { localization } from '@/libs/language';

// This is just the beginning of organizing the test data, it should be imrpoved
/*export const socialConditionsAndCrime = 'Sosiale forhold og kriminalitet (2)';
export const workAndPay = 'Arbeid og lønn (7)';
export const population = 'Befolkning (25)';
export const workAndPayPlusPopulationHits = '32 treff';
export const bankingAndFinancialMarked = 'Bank og finansmarked (1)';
export const companiesEnterprises = 'Bedrifter, foretak og regnskap (20)';
export const totalVariablesHits = '78 treff';
export const statusDraft = `${localization.status.draft} (73)`;
export const removeStatusDraft = 'Remove Utkast (73)';
export const statusDraftTotalHits = '3 treff';
export const statusInternalTotalHits = '3 treff';
export const statusInternal = `${localization.status.publishedInternal} (3)`;
export const removeStatusInternal = `${localization.status.publishedInternal} (3)`;
export const statusExternalTotalHits = '2 treff';
export const statusExternal = `${localization.status.publishedExternal} (2)`;
export const removeStatusExternal = `${localization.status.publishedInternal} (3)`;
export const statusInternalPlusExternalTotalHits = '5 treff';*/

export const statuses = {
  draft: {
    label: `${localization.status.draft} (73)`,
    removeLabel: 'Remove Utkast (73)',
    totalHits: '3 treff',
  },
  internal: {
    label: `${localization.status.publishedInternal} (3)`,
    removeLabel: `${localization.status.publishedInternal} (3)`,
    totalHits: '3 treff',
  },
  external: {
    label: `${localization.status.publishedExternal} (2)`,
    removeLabel: `${localization.status.publishedExternal} (2)`,
    totalHits: '2 treff',
  },
  internalPlusExternal: {
    totalHits: '5 treff',
  },
};

export const variables = {
  socialConditionsAndCrime: 'Sosiale forhold og kriminalitet (2)',
  workAndPay: 'Arbeid og lønn (7)',
  population: 'Befolkning (25)',
  workAndPayPlusPopulationHits: '32 treff',
  bankingAndFinancialMarket: 'Bank og finansmarked (1)',
  companiesEnterprises: 'Bedrifter, foretak og regnskap (20)',
  totalHits: '78 treff',
};
