import { localization } from '@/libs/language/src/localization';
import { TabItem } from '@/types/tabs';

export const ID = 'ID';
export const NB = 'nb';
export const ACCEPT_LANGUAGE = 'accept-language';

//export const CLASSIFICATIONS = 'classifications';
export const CLASSIFICATION_FAMILIES = 'classificationfamilies';

export const KLASSIFIKASJONER = 'Klassifikasjoner';
export const DATASETS = 'Datasett';
export const VARIABELDEFINISJONER = 'Variabeldefinisjoner';

export const LANDBAKGRUNN = 'Landbakgrunn';

export const SUBJECT_AREA = 'Statistikkområde';

export const REMOVE_ALL_FILTERS = 'Fjern alle filtere';

export const VARDEF_TAB = 'vardefTab';
export const KLASS_TAB = 'klassTab';
export const DATASET_TAB = 'datasetTab';

export const classificationsPath = '/classifications';

export const variableDefinitionsPath = '/variable-definitions';

export const datasetPath = '/datasets';

export const filter = {
  sortNameAsc: 'Navn (A–Z)',
  sortNameDesc: 'Navn (Z–A)',
  sortLastUpdated: 'Sist oppdatert',
};

export const tabs: TabItem[] = [
  {
    value: VARDEF_TAB,
    label: localization.variableDefinitions,
    searchLabel: localization.search.searchForVariableDefinitions,
    href: variableDefinitionsPath,
  },
  {
    value: KLASS_TAB,
    label: localization.classifications,
    searchLabel: localization.search.searchForClassifications,
    href: classificationsPath,
  },
  {
    value: DATASET_TAB,
    label: localization.dataset,
    searchLabel: localization.search.searchForDatasets,
    href: datasetPath,
  },
];
