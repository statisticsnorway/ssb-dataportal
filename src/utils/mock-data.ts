import { RenderedView, RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';

export const testVardefData: RenderedView[] = variableDefinitionsJson.map(RenderedViewFromJSON);
