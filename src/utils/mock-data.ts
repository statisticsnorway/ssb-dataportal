import variableDefinitionsJson from '@/data/variable-definitions.json';
import { RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import { VardefTabData } from './vardefTabContext';

export const testVardefData: VardefTabData = {
  variableDefinitions: variableDefinitionsJson.map(RenderedViewFromJSON),
};
