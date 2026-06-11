/**
 * Maps a subject field code (`string`) to the classification family IDs
 * (`number[]`) associated with that subject field.
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
  sk: [16],
  ti: [18],
  tr: [19],
  ud: [20],
  ut: [21],
  va: [22],
  vt: [23],
  vf: [24],
};
