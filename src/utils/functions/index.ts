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

/**
 * Utility type which guarantees that all fields in a type are non-null
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Filter objects with null or undefined fields
 * @param myObject the object to check
 * @returns false if any field is null or undefined. Narrows the type with the help of utility types
 */
export function fieldsNotNull<T>(myObject: T): myObject is Required<NonNullableFields<T>> {
  for (var i in myObject) {
    if (myObject[i] === null || myObject[i] === undefined) return false;
  }
  return true;
}
