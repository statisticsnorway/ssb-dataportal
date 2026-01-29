import { fetchSubjectFields } from '@/libs/data/classifications/subjectFieldLookup';
import { listRenderedVariableDefinitions } from '@/libs/data/variable-definitions/variableDefinitions';
import { ResponseError } from '@/libs/data-access/variable-definitions/internal';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default async function VariableDefinitions() {
  let data: RenderedView[] = [];
  let errorMessage: string | null = null;

  const subjectFieldsPromise = fetchSubjectFields();
  const variableDefsPromise = listRenderedVariableDefinitions();

  try {
    data = await variableDefsPromise;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      switch (error.response.status) {
        case 401:
        case 403:
          errorMessage = 'Unauthorized';
          break;
        case 500:
        default:
          errorMessage = 'Unknown';
      }
    } else {
      errorMessage = 'Unknown';
    }
  }

  const subjectFields = await subjectFieldsPromise;

  return (
    <VariableDefinitionsServicePage
      variables={data}
      errorMessage={errorMessage}
      subjectFields={subjectFields}
    />
  );
}
