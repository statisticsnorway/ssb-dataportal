import subjectFieldaMock from '@/static-data/subjectField.json';
import { SubjectField } from '@/types/subjectField';

export const SUBJECT_FIELD_LOOKUP: Record<string, string> = {
  be: 'Befolkning',
  tr: 'Transport',
};

export async function fetchSubjectFields(): Promise<SubjectField[]> {
  return subjectFieldaMock.codes;
}
