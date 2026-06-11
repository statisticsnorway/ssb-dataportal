type SubjectFieldCode = string;
type ClassificationFamilyId = number;

export const SUBJECT_FIELD_BY_CODE: Record<SubjectFieldCode, ClassificationFamilyId[]> = {
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
