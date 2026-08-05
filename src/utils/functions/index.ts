import { Assessment, DatasetState } from '@/libs/data-access/datadoc/models';
import { KlassReference, VariableStatus } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import { Item } from '@/types/item';

type RequiredField<T, Field extends keyof T> = Omit<T, Field> &
  Required<Pick<T, Field>> & { [P in keyof T]: NonNullable<T[P]> };

export function areFieldsDefinedAndNonNull<T extends {}, U extends Array<keyof T>>(
  obj: T | null | undefined,
  fields: U,
): obj is RequiredField<T, U[number]> {
  return obj != null && obj != undefined && fields.every((field) => obj[field] !== undefined && obj[field] !== null);
}

export const formatDate = (date?: Date) => date?.toISOString().split('T')[0] || '-';

/**
 * Formats a date value to a Norwegian Bokmål locale date string (`nb-NO`).
 *
 * Returns an empty string when the input is missing or cannot be parsed as a valid date.
 *
 * @param date - A `Date` instance, date string, or `undefined`.
 * @returns The formatted date string, or an empty string if invalid/missing.
 */
export const formatLocaleDate = (date: Date | string | undefined) => {
  if (!date) return '';
  const parsedDate = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toLocaleDateString('nb-NO');
};

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

export const convertDataSetState = (datasetState: DatasetState) => {
  switch (datasetState) {
    case DatasetState.PROCESSED_DATA:
      return localization.products.datasetState.processedData;
    case DatasetState.OUTPUT_DATA:
      return localization.products.datasetState.outputData;
    case DatasetState.INPUT_DATA:
      return localization.products.datasetState.inputData;
    case DatasetState.SOURCE_DATA:
      return localization.products.datasetState.sourceData;
    case DatasetState.STATISTICS:
      return localization.products.datasetState.statistics;
    default:
      datasetState satisfies never;
  }
};

export const convertAssessment = (assessment: Assessment) => {
  switch (assessment) {
    case Assessment.PROTECTED:
      return localization.products.assessment.protected;
    case Assessment.OPEN:
      return localization.products.assessment.open;
    case Assessment.SENSITIVE:
      return localization.products.assessment.sensitive;
    default:
      assessment satisfies never;
  }
};

export function getDevEnvironmentName(): string | undefined {
  return process.env.DEV_ENVIRONMENT_NAME;
}

export const sanitizeId = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

/**
 * Returns the top-level (parent) code for a given code item.
 *
 * If the provided code is a "child" code (length > 2), the first
 * two characters (parent code) are returned. Otherwise, the code
 * itself is returned.
 *
 * @param code - The code to normalize.
 * @returns The normalized top-level code.
 * @throws Error if the code is empty or only whitespace.
 */
export const getParentCode = (code: string): string => {
  if (!code || code.trim() == '') {
    throw new Error('Code cannot be empty');
  }
  return isChildCode(code) ? code?.slice(0, 2) : code;
};

/**
 * Checks if a code is a child code.
 *
 * A code is considered a child if its length is greater than 2.
 *
 * @param code - The code to check.
 * @returns True if the code is a child, false otherwise.
 */
const isChildCode = (code: string): boolean => {
  return code?.length > 2;
};

/**
 * Retrieves the label corresponding to a code from a filter list.
 *
 * @param code - The code to look up.
 * @param filterList - The list of FilterItem objects to search.
 * @returns The label matching the code, or an empty string if none found.
 */
export const getLabelByCode = (code: string, filterList: FilterItem[]): string => {
  return filterList.find((item) => item.value === code)?.label ?? '';
};

/**
 * Builds a label string including the parent label (if available).
 *
 * If the code is a child code and a parent label exists in the
 * filter list, the returned string is in the format:
 * `"Parent Label → Child Title"`. Otherwise, only the child title is returned.
 *
 * @param klassReference - The KlassReference object containing the code and title.
 * @param filterList - The list of FilterItem objects to use for parent label lookup.
 * @returns A label string including the parent if available, otherwise just the child title.
 */
export const getLabelWithParent = (klassReference: KlassReference, filterList: FilterItem[]): string => {
  if (!isChildCode(String(klassReference?.code))) {
    return String(klassReference?.title);
  }
  const parentLabel = getLabelByCode(getParentCode(String(klassReference?.code)), filterList);
  return parentLabel ? `${parentLabel} → ${String(klassReference?.title)}` : String(klassReference?.title);
};

export function assertUnreachable(x: never): never {
  throw new Error('The impossible has happened.');
}
