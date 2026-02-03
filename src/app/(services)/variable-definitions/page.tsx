import { listRenderedVariableDefinitions } from '@/libs/data/variable-definitions/variableDefinitions';
import { ResponseError } from '@/libs/data-access/variable-definitions/internal';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models';
import { localization } from '@/libs/language';
import { fetchStaticSubjectFields } from '@/utils/mock-data';
import VariableDefinitionsServicePage from './variable-definitions-service-page';

export default async function VariableDefinitions() {
  let data: RenderedView[] = [];
  let errorMessage: string | null = null;

  const subjectFieldsPromise = fetchStaticSubjectFields();
  const variableDefsPromise = listRenderedVariableDefinitions();

  try {
    data = await variableDefsPromise;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      switch (error.response.status) {
        case 401:
        case 403:
        case 404:
          errorMessage = localization.error.unauthorized;
          break;
        case 500:
        default:
          errorMessage = localization.error.somethingWentWrong;
      }
    } else {
      errorMessage = localization.error.somethingWentWrong;
    }
  }

  const subjectFields = await subjectFieldsPromise;

  return <VariableDefinitionsServicePage variables={data} errorMessage={errorMessage} subjectFields={subjectFields} />;
}
