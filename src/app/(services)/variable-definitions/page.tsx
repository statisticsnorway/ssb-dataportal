import { listRenderedVariableDefinitions } from '@/libs/data/variable-definitions/variableDefinitions';
import { fetchStaticSubjectFields } from '@/utils/mock-data';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default async function VariableDefinitions() {
  const subjectFieldsPromise = fetchStaticSubjectFields()
    .then((data) => ({ data, error: null }))
    .catch((error) => ({ data: [], error }));

  const variableDefsPromise = listRenderedVariableDefinitions()
    .then((data) => ({ data, error: null }))
    .catch((error) => ({ data: [], error }));

  return (
    <VariableDefinitionsServicePage
      variablesPromise={variableDefsPromise}
      subjectFieldsPromise={subjectFieldsPromise}
    />
  );
}
