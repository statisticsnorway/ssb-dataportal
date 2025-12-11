/**
 * Generally used to produce a uniq hash array items.
 * Unlike uniqId() of lodash, it garanties that an array
 * item always has the same key value
 * @param s a string to hash
 * @returns the hash code of the string
 */
export const hashCode = (s: string) => {
  let i, h;
  for (i = 0, h = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
};

// biome-ignore lint/suspicious/noExplicitAny: <Not sure why this code is used>
export const isObjectNullUndefinedEmpty = (object: any | null | undefined) =>
  object === undefined ||
  object === null ||
  Object.keys(object).length === 0 ||
  Object.values(object).every((x) => x === null || x === '');

type RequiredField<T, Field extends keyof T> = Omit<T, Field> &
  Required<Pick<T, Field>> & { [P in keyof T]: NonNullable<T[P]> };

export function areFieldsDefinedAndNonNull<T extends {}, U extends Array<keyof T>>(
  obj: T | null | undefined,
  fields: U,
): obj is RequiredField<T, U[number]> {
  return obj != null && obj != undefined && fields.every((field) => obj[field] !== undefined && obj[field] !== null);
}

export const joinOrEmpty = (arr?: string[] | null) => arr?.join(', ') || '';
export const formatDate = (date?: Date) => date?.toISOString().split('T')[0] || '-';
export const formatArray = (arr?: string[]) => joinOrEmpty(arr || []);
export const optionalString = (str?: string, fallback = '-') => str || fallback;
export const yesNo = (flag?: boolean) => (flag ? 'Ja' : 'Nei');


export const convertStatus = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'Utkast';
    case 'PUBLISHED_INTERNAL':
      return 'Publisert internt';
    case 'PUBLISHED_EXTERNAL':
      return 'Publisert eksternt';
    default:
      return status;
  }
};