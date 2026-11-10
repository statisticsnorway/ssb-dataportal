import type { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import {
  DaplaDataFileDTOFromJSON,
  DataProductDTOFromJSON,
  DatasetDTOFromJSON,
  DatasetVariableDTOFromJSON,
} from '@/libs/data-access/datadoc';
import {
  type ClassificationVersionResource,
  type SearchResultResource,
  SearchResultResourceFromJSON,
} from '@/libs/data-access/klass';
import type { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import codesMock from '@/static-data/codes-mock.json';
import dataFilesJson from '@/static-data/data-files/ds-1.json';
import dataProductsJson from '@/static-data/data-products.json';
import datasetVariablesJson from '@/static-data/dataset-variables.json';
import datasetsJson from '@/static-data/datasets.json';
import searchResultsJson from '@/static-data/klass-search-results.json';
import versionsJson from '@/static-data/versions.json';
import type { FilterItem } from '@/types/filters';
import type { KlassCode } from '@/types/klass-codes';
import { getClassification, getStaticVariableDefinitions, parseVersion } from '@/utils/mock-data';

export const toPromiseResult = <T>(data: T): Promise<{ data: T; error: Error | null }> =>
  Promise.resolve({ data, error: null });

export const mockDataProducts = dataProductsJson.map((item) => DataProductDTOFromJSON(item));
export const mockDatasets = datasetsJson.map((item) => DatasetDTOFromJSON(item));
export const mockDataFiles = dataFilesJson.map((item) => DaplaDataFileDTOFromJSON(item));
export const mockDatasetVariables = (datasetVariablesJson.id11 ?? []).map((item) => DatasetVariableDTOFromJSON(item));
export const mockVariables: RenderedView[] = getStaticVariableDefinitions();
export const mockClassification: ClassificationWithLanguage = getClassification(2003);
export const mockClassificationVersion: ClassificationVersionResource = parseVersion(
  versionsJson.versions.find((version) => version.id === 1),
);
export const mockSearchResults: SearchResultResource[] = searchResultsJson.map((item) =>
  SearchResultResourceFromJSON(item),
);
export const mockSubjectFields: KlassCode[] = (codesMock.versionCodes['2828'] ?? []).map((item) => ({
  code: String(item.code),
  parentCode: item.parentCode ?? null,
  level: String(item.level),
  name: String(item.name),
  validFrom: '2000-01-01',
  notes: item.notes ?? undefined,
}));

export const mockFilterItems: FilterItem[] = [
  { value: 'active', label: 'Active', count: 8 },
  { value: 'archived', label: 'Archived', count: 3 },
];

export const mockDataProduct = mockDataProducts[0]!;
export const mockDataset = mockDatasets.find((dataset) => dataset.id === 'ds-1')!;
export const mockDataFileSearchHit = DaplaDataFileDTOFromJSON(dataFilesJson[0]);
export const mockDataProductsPromise = toPromiseResult(mockDataProducts);
export const mockDatasetVariable = mockDatasetVariables[0]!;
export const mockVariable = mockVariables.find((variable) => variable.short_name === 'aksje')!;
export const mockVariableDefinitionsPromise = toPromiseResult(mockVariables);
export const mockSubjectFieldsPromise = toPromiseResult(mockSubjectFields);
export const mockClassificationsPromise = toPromiseResult([mockClassification]);
export const mockSearchResultsPromise = toPromiseResult(mockSearchResults);
export const mockMatchingSearchResultsPromise = toPromiseResult([
  { id: 2003, language: 'nb', name: mockClassification.name, snippet: mockClassification.description },
]);
