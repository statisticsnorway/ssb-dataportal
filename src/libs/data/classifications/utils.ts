import { HTTPQuery } from '@/libs/data-access/klass';
import { SupportedLanguages } from '@/libs/data-access/variable-definitions/internal/models/SupportedLanguages';
import { SupportedLanguage } from '@/libs/language';

/**
 * Duplicate of the generated function querystring in src/libs/data-access/klass/runtime.ts
 */
export function querystringFormatDates(params: HTTPQuery, prefix: string = ''): string {
  return Object.keys(params)
    .map((key) => querystringSingleKey(key, params[key], prefix))
    .filter((part) => part.length > 0)
    .join('&');
}

/**
 * Duplicate of the generated function in src/libs/data-access/klass/runtime.ts
 *
 * Modified to format dates as expected by the Klass API.
 */
function querystringSingleKey(
  key: string,
  value:
    | string
    | number
    | null
    | undefined
    | boolean
    | Array<string | number | null | boolean>
    | Set<string | number | null | boolean>
    | HTTPQuery,
  keyPrefix: string = '',
): string {
  const fullKey = keyPrefix + (keyPrefix.length ? `[${key}]` : key);
  if (value instanceof Array) {
    const multiValue = value
      .map((singleValue) => encodeURIComponent(String(singleValue)))
      .join(`&${encodeURIComponent(fullKey)}=`);
    return `${encodeURIComponent(fullKey)}=${multiValue}`;
  }
  if (value instanceof Set) {
    const valueAsArray = Array.from(value);
    return querystringSingleKey(key, valueAsArray, keyPrefix);
  }
  if (value instanceof Date) {
    // Klass expects date strings in YYYY-MM-DD format
    return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value.toISOString().slice(0, 10))}`;
  }
  if (value instanceof Object) {
    return querystringFormatDates(value as HTTPQuery, fullKey);
  }
  return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
}

export const FALLBACK_ORDER: SupportedLanguage[] = [
  SupportedLanguages.Nb,
  SupportedLanguages.Nn,
  SupportedLanguages.En,
];
