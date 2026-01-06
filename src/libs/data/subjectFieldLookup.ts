import subjectFieldaMock from '@/static-data/subject-fields.json';
import { SubjectField } from '@/types/subjectField';

export const SUBJECT_FIELD_LOOKUP: Record<string, string> = {
  be: 'Befolkning',
  tr: 'Transport',
};

export async function fetchSubjectFields(): Promise<SubjectField[]> {
  return subjectFieldaMock.codes;
}
