import { ClassificationResource, ClassificationResourceFromJSONTyped } from '@/libs/data-access/klass';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { Item } from '@/types/item';

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
export const yesNo = (flag?: boolean) => (flag ? localization.yes : localization.no);
export const nonEmpty = (items: Item[]) =>
  items.filter((i) => (Array.isArray(i.value) ? i.value.length > 0 : !!i.value));

export const convertStatus = (status: VariableStatus) => {
  switch (status) {
    case VariableStatus.Draft:
      return localization.status.draft;
    case VariableStatus.PublishedInternal:
      return localization.status.publishedInternal;
    case VariableStatus.PublishedExternal:
      return localization.status.publishedExternal;
    default:
      status satisfies never;
  }
};

/**
 * Check if an object is compatible with type 'ClassificationResource'
 *
 * @param value - object to check
 * @returns true if object is a valid 'ClassificationResource'
 */
export function instanceOfClassification(value: object): value is ClassificationResource {
  if (!('id' in value) || value['id'] === undefined) return false;
  if (!('name' in value) || value['name'] === undefined) return false;
  if (!('classificationType' in value) || value['classificationType'] === undefined) return false;
  if (!('lastModified' in value) || value['lastModified'] === undefined) return false;
  if (!('_links' in value)) return false;
  return true;
}

/**
 * Parse json to valid 'ClassificationResource'
 *
 * @param json
 * @returns ClassificationResource
 */
export function parseClassification(json?: object | null): ClassificationResource {
  if (json == null) {
    throw new Error(`Object is null: ${json}`);
  }
  if (!instanceOfClassification(json)) {
    throw new Error(`Invalid classification: ${json}`);
  }
  return ClassificationResourceFromJSONTyped(json, true);
}

export function getDevEnvironmentName(): string | undefined {
  return process.env.DEV_ENVIRONMENT_NAME;
}

//TODO: Add test
/**
 * Build a label string with an optional count.
 */
export const buildTagsLabel = (label?: string, count?: number) => {
  return `${label} (${count ?? 0})`;
};

export const sanitizeId = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

/**
 * Maps each VariableStatus to a corresponding CSS color variable.
 */
export const statusColors: Record<VariableStatus, string> = {
  [VariableStatus.Draft]: 'var(--status-draft)',
  [VariableStatus.PublishedInternal]: 'var(--status-published-internal',
  [VariableStatus.PublishedExternal]: 'var(--status-published-external',
};

/**
 * Normalizes a subject area code to its top-level code.
 *
 * If the provided code represents a level 2 code (length > 2),
 * the parent code is returned by extracting the first two characters.
 * Otherwise, the code is returned unchanged.
 *
 * @param code - Subject area code.
 * @returns The normalized top-level subject area code.
 */
export const extractSubjectAreaCode = (code: string): string => {
  if (!code || code.trim() == '') {
    throw new Error('Subject area code cannot be empty');
  }
  return isSubjectAreaChild(code) ? code?.slice(0, 2) : code;
};

/**
 * Check if subject area code child of parent code
 *
 * If code is longer than 2 characters it is level 2
 *
 * @param code
 * @returns true if code is level 2
 */
export const isSubjectAreaChild = (code: string): boolean => {
  return code?.length > 2;
};

// add test
export const getSubjectAreaParentTitle = (code: string, subjectFields: FilterItem[]): string => {
  return subjectFields.find((item) => item.value === code)?.label ?? '';
};

// add test
export const createSubjectAreaLabel = (code: string, title: string, subjectFields: FilterItem[]): string => {
  if (isSubjectAreaChild(code)) {
    return `${getSubjectAreaParentTitle(extractSubjectAreaCode(code), subjectFields)} \u2192 ${title}`;
  } else {
    return title;
  }
};
