import { ReactNode } from 'react';
import { localization } from '@/libs/language';
import { Item } from '@/types/item';

/**
 * Determines whether a React node contains a value that should be rendered.
 *
 * Treats `null`, `undefined`, `false`, empty strings, and arrays containing only non-displayable values as not displayable.
 *
 * @param value - The React node to evaluate.
 * @returns `true` if the value should be displayed; otherwise `false`.
 */
const hasDisplayValue = (value: ReactNode | undefined | null): boolean => {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.some((v) => hasDisplayValue(v));
  return true;
};

/**
 * Adds a labeled row to the output list for the "details" section.
 *
 * If `value` is not displayable (for example `null`, `undefined`, `false`, or an empty string),
 * the localized fallback text for "not relevant" is used instead in the "details" section.
 *
 * @param rows - Mutable list of rows to append to.
 * @param label - Row label shown in the UI.
 * @param value - Row value to render.
 */
export const addRow = (rows: Item[], label: string, value: ReactNode | undefined | null) => {
  rows.push({
    label,
    value: hasDisplayValue(value) ? value : localization.noDataPlaceholder,
  });
};
