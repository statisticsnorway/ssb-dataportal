import subjectFieldaMock from '@/static-data/subject-fields.json';
import { CodeItem } from '../data-access/klass';

export const SUBJECT_FIELD_LOOKUP: Record<string, string> = {
  be: 'Befolkning',
  tr: 'Transport',
};

export async function fetchSubjectFields(): Promise<CodeItem[]> {
  return subjectFieldaMock.codes.map((item) => ({
    ...item,
    parentCode: item.parentCode ?? undefined,
    validFrom: item.validFrom ?? undefined,
    validTo: item.validTo ?? undefined,
  }));
}
