import { RenderedView, RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import classificationsMock from '@/static-data/classifications.json';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { Classification } from '@/types/classification';
import { parseClassification } from './functions';

export const testVardefData: RenderedView[] = variableDefinitionsJson.map(RenderedViewFromJSON);

export function getVariableDefinitionById(id: string | number): RenderedView | undefined {
  const variableDefinitions = testVardefData;
  return variableDefinitions.find((v) => String(v.id) === String(id));
}

export function getClassification(id: number): Classification | undefined {
  const classifications = classificationsMock.classifications;
  const classification = classifications.find((v) => v.id === id);
  const parsedClassification = parseClassification(classification);
  return parsedClassification;
}
