import { ClassificationItemResource, HTTPQuery, VersionsLanguageEnum } from '@/libs/data-access/klass';
import { SupportedLanguages } from '@/libs/data-access/variable-definitions/internal/models/SupportedLanguages';
import { SupportedLanguage } from '@/libs/language';
import { KlassCode } from '@/types/klass-codes';

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

const TO_KLASS: Record<SupportedLanguage, VersionsLanguageEnum> = {
  nb: VersionsLanguageEnum.NB,
  nn: VersionsLanguageEnum.NN,
  en: VersionsLanguageEnum.EN,
};

const FROM_KLASS: Record<VersionsLanguageEnum, SupportedLanguage> = {
  [VersionsLanguageEnum.NB]: 'nb',
  [VersionsLanguageEnum.NN]: 'nn',
  [VersionsLanguageEnum.EN]: 'en',
};

export function toKlassLanguage(lang: SupportedLanguage): VersionsLanguageEnum {
  return TO_KLASS[lang];
}

export function fromKlassLanguage(lang: VersionsLanguageEnum): SupportedLanguage {
  return FROM_KLASS[lang];
}

/**
 * Given the requested language and a set of published-language arrays from each
 * resource on the page, pick the best common language.
 *
 * Returns `{ effective, fallbackFrom }` where `fallbackFrom` is the originally
 * requested language when a fallback was needed, else `undefined`.
 */
export function resolvePageLanguage(
  requested: SupportedLanguage,
  publishedSets: ReadonlyArray<ReadonlyArray<SupportedLanguage>>,
): { effective: SupportedLanguage; fallbackFrom?: SupportedLanguage } {
  const intersection = FALLBACK_ORDER.filter((lang) => publishedSets.every((set) => set.includes(lang)));

  if (intersection.includes(requested)) return { effective: requested };

  const preferred =
    [requested, ...FALLBACK_ORDER.filter((l) => l !== requested)].find((l) => intersection.includes(l)) ?? 'nb';

  return { effective: preferred, fallbackFrom: preferred === requested ? undefined : requested };
}

export interface KlassCodeWithLanguage extends KlassCode {
  /** Language actually used to populate `name`/`shortName`. Undefined when it matches the requested language. */
  fallbackLanguage?: SupportedLanguage;
}

export interface ClassificationItemWithLanguage extends ClassificationItemResource {
  /** Language actually used to populate `name`/`shortName`. Undefined when it matches the requested language. */
  fallbackLanguage?: SupportedLanguage;
}
