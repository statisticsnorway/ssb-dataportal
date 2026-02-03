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
import { parseClassification } from './functions';

export function getVariableDefinitions(): Array<RenderedView> {
  return variableDefinitionsJson.map(RenderedViewFromJSON);
}
export function getVariableDefinitionById(id: string | number): RenderedView | undefined {
  return getVariableDefinitions().find((v) => String(v.id) === String(id));
}

export function getClassification(id: number): ClassificationResource | undefined {
  const classifications = classificationsMock.classifications;
  const classification = classifications.find((v) => v.id === id);
  const parsedClassification = parseClassification(classification);
  return parsedClassification;
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

export async function fetchStaticSubjectFields(): Promise<CodeItem[]> {
  return subjectFieldsMock.codes.map((item) => ({
    ...item,
    parentCode: item.parentCode ?? undefined,
    validFrom: item.validFrom ?? undefined,
    validTo: item.validTo ?? undefined,
  }));
}
