import { CodeItem } from '@/libs/data-access/klass/models/CodeItem';
import { clientLogger } from '@/libs/logger/client-logger';

/**
 * Maps a subject field code (`string`) to the classification family IDs
 * (`number[]`) associated with that subject field.
 *
 * Includes a synthetic mapping for the "Region" family (`'15' -> [15]`),
 * which is not part of the regular statistical subject hierarchy.
 *
 * Used when filtering data by subject field, where a subject field code
 * is translated into one or more classification family IDs.
 */
export const SUBJECT_FIELD_BY_CODE: Record<string, number[]> = {
  al: [1],
  bf: [2],
  be: [3, 8],
  bb: [4],
  ei: [5],
  he: [6],
  js: [9],
  nk: [11],
  nm: [12],
  os: [13],
  pp: [14],
  '15': [15],
  sk: [16],
  ti: [18],
  tr: [19],
  ud: [20],
  ut: [21],
  va: [22],
  vt: [23],
  vf: [24],
  zm: [25],
};

/**
 * Synthetic subject field representing classification family 15 ("Region").
 *
 * Added to subject field lists so Region can be shown and filtered
 * like other subject fields.
 */
export const regionFamily: CodeItem = {
  code: '15',
  name: 'Region',
};

/**
 * Returns the subject field code for a given classification family ID,
 * or `undefined` if no match is found.
 */
export const getSubjectCodeByFamilyId = (familyId?: number, classificationId?: number) => {
  if (familyId == null) {
    clientLogger.info({ classificationId }, 'No family ID provided for classification');
    return undefined;
  }
  const result = Object.entries(SUBJECT_FIELD_BY_CODE).find(([, familyIds]) => familyIds.includes(familyId))?.[0];
  if (result == null) {
    clientLogger.info({ familyId, classificationId }, 'No subject field mapping found for classification family ID');
  }
  return result;
};
