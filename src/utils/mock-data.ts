import { ClassificationFamilyResource, ClassificationSummaryResource } from '@/libs/data-access/klass';
import { RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { RawClassificationFamily } from '@/types/classification';
import { VardefTabData } from './vardefTabContext';

export const testVardefData: VardefTabData = {
  variableDefinitions: variableDefinitionsJson.map(RenderedViewFromJSON),
};

/**
 * Transforms JSON read from file into proper typed objects
 */
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
