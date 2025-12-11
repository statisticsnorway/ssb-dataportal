import { RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { VardefTabData } from './vardefTabContext';

export const testVardefData: VardefTabData = {
  variableDefinitions: variableDefinitionsJson.map(RenderedViewFromJSON),
};
