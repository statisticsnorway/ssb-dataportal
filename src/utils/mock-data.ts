import { ClassificationResource } from '@/libs/data-access/klass';
import { RenderedView, RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import classificationsMock from '@/static-data/classifications.json';
import subjectFieldsMock from '@/static-data/subject-fields.json';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { FilterItem } from '@/types/filters';
import { parseClassification } from './classifications/classificationHelpers';

export function getStaticVariableDefinitions(): Array<RenderedView> {
  return variableDefinitionsJson.map(RenderedViewFromJSON);
}
export function getStaticVariableDefinitionByShortName(shortName: string): RenderedView | undefined {
  return getStaticVariableDefinitions().find((v) => String(v.short_name) === shortName);
}
export function getStaticVariableDefinitionById(id: string): RenderedView | undefined {
  return getStaticVariableDefinitions().find((v) => String(v.id) === id);
}

export function getClassification(id: number): ClassificationResource {
  const classifications = classificationsMock.classifications;
  const classification = classifications.find((v) => v.id === id);
  return parseClassification(classification);
}

export const getSubjectFieldFilterItems: FilterItem[] = subjectFieldsMock.codes.map((item) => ({
  label: String(item.name),
  value: String(item.code),
}));
