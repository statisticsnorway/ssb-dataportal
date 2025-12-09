import { Classification, ClassificationType } from '@/types/classification';

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
  obj: T,
  fields: U,
): obj is RequiredField<T, U[number]> {
  return obj != null && obj != undefined && fields.every((field) => obj[field] !== undefined && obj[field] !== null);
}

// biome-ignore lint/suspicious/noExplicitAny: <Needs any for parsing json in test>
export function parseClassification(json: any): Classification {
  if (
    typeof json.id !== 'number' ||
    typeof json.name !== 'string' ||
    typeof json.classificationType !== 'string' ||
    typeof json.lastModified !== 'string' ||
    !json._links
  ) {
    throw new Error(`Invalid classification JSON: ${JSON.stringify(json)}`);
  }

  if (!(json.classificationType in ClassificationType)) {
    throw new Error(`Invalid classificationType: ${json.classificationType}`);
  }

  return {
    id: json.id,
    name: json.name,
    classificationType: ClassificationType[json.classificationType as keyof typeof ClassificationType],
    lastModified: json.lastModified,
    _links: json._links,
  };
}
