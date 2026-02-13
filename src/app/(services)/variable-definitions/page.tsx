import { getVariableDefinitionsCached } from '@/libs/data/variable-definitions/cachedVariableDefinitions';
import { fetchStaticSubjectFields } from '@/utils/mock-data';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default async function VariableDefinitions() {
  const subjectFieldsPromise = fetchStaticSubjectFields()
    .then((data) => ({ data, error: null }))
    .catch((error) => ({ data: [], error }));

  const variableDefsPromise = getVariableDefinitionsCached()
    .then((data) => ({ data, error: null }))
    .catch((error) => ({ data: [], error }));

  return (
    <VariableDefinitionsServicePage
      variablesPromise={variableDefsPromise}
      subjectFieldsPromise={subjectFieldsPromise}
    />
  );
}
