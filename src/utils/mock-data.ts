import { cache } from 'react';
import {
  ClassificationFamilyResource,
  ClassificationResource,
  ClassificationSummaryResource,
  CodeItem,
} from '@/libs/data-access/klass';
import { RenderedView, RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import classificationsMock from '@/static-data/classifications.json';
import subjectFieldsMock from '@/static-data/subject-fields.json';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { RawClassificationFamily } from '@/types/classification';
import { FilterItem } from '@/types/filters';
import { parseClassification } from './functions';

export function getVariableDefinitions(): Array<RenderedView> {
  return variableDefinitionsJson.map(RenderedViewFromJSON);
}
export function getVariableDefinitionByShortName(shortName: string | number): RenderedView | undefined {
  return getVariableDefinitions().find((v) => String(v.short_name) === String(shortName));
}

export function getClassification(id: number): ClassificationResource {
  const classifications = classificationsMock.classifications;
  const classification = classifications.find((v) => v.id === id);
  return parseClassification(classification);
}

/** * Transforms JSON read from file into proper typed objects */
export function transformClassificationFamilies(rawData: RawClassificationFamily[]): ClassificationFamilyResource[] {
  return rawData.map((family) => ({
    ...family,
    classifications: family.classifications.map(
      (c: RawClassificationFamily['classifications'][number]): ClassificationSummaryResource => ({
        ...c,
        lastModified: new Date(c.lastModified),
      }),
    ),
  }));
}

export const fetchStaticSubjectFields = cache(async (): Promise<CodeItem[]> => {
  return subjectFieldsMock.codes.map((item) => ({
    ...item,
    parentCode: item.parentCode ?? undefined,
    validFrom: item.validFrom ?? undefined,
    validTo: item.validTo ?? undefined,
  }));
});

export const getSubjectFieldFilterItems: FilterItem[] = subjectFieldsMock.codes.map((item) => ({
  label: String(item.name),
  value: String(item.code),
}));
