import { localization } from '@/libs/language';

// For sorting strings in ascending order (case-insensitive) using Norwegian locale
export const sortAscending = (a: string | null | undefined, b: string | null | undefined) => {
  if (typeof a !== 'string' || a === '') return 1;
  if (typeof b !== 'string' || b === '') return -1;
  return a.localeCompare(b, localization.getLanguage(), { sensitivity: 'base' });
};

// For sorting strings in descending order (case-insensitive) using Norwegian locale
export const sortDescending = (a: string | null | undefined, b: string | null | undefined) => {
  if (typeof a !== 'string' || a === '') return -1;
  if (typeof b !== 'string' || b === '') return 1;
  return b.localeCompare(a, localization.getLanguage(), { sensitivity: 'base' });
};

// For sorting ISO 8601 date strings in ascending order
export const sortDateStringsAscending = (a: string | null | undefined, b: string | null | undefined) => {
  if (typeof a !== 'string' || a === '') return 1;
  if (typeof b !== 'string' || b === '') return -1;
  return new Date(a).getTime() - new Date(b).getTime();
};

// For sorting ISO 8601 date strings in descending order
export const sortDateStringsDescending = (a: string | null | undefined, b: string | null | undefined) => {
  if (typeof a !== 'string' || a === '') return -1;
  if (typeof b !== 'string' || b === '') return 1;
  return new Date(b).getTime() - new Date(a).getTime();
};

export const toTimestamp = (value?: Date | string) => {
  if (!value) return 0; // missing value → fallback
  if (value instanceof Date) return value.getTime(); // Date → timestamp
  return new Date(value).getTime(); // string → parse to timestamp
};

export const sortDatesAscendingSafe = (a?: Date | string, b?: Date | string) => {
  return toTimestamp(a) - toTimestamp(b);
};

export const sortDatesDescendingSafe = (a?: Date | string, b?: Date | string) => {
  return toTimestamp(b) - toTimestamp(a);
};
