import type { LogicalTypeKind, PhysicalType } from '@/libs/data-access/datadoc';
import type { SupportedLanguage } from '@/libs/language';
import { en } from '@/libs/language/src/en';
import { nb } from '@/libs/language/src/nb';
import { nn } from '@/libs/language/src/nn';

/** Exhaustive over the generated enums, so a type added to the Datadoc spec fails to compile until it is labelled. */
const parquetTypeLabels: Record<SupportedLanguage, Record<PhysicalType | LogicalTypeKind, string>> = {
  en: en.parquetTypes,
  nb: nb.parquetTypes,
  nn: nn.parquetTypes,
};

function isKnownType(typeName: string): typeName is PhysicalType | LogicalTypeKind {
  return Object.hasOwn(parquetTypeLabels.en, typeName);
}

/** Formats a Parquet physical or logical type name for display. Datadoc types the names as plain strings. */
export function formatParquetType(typeName: string, language: string = 'en'): string {
  if (isKnownType(typeName)) {
    const supportedLanguage: SupportedLanguage = language === 'nb' || language === 'nn' ? language : 'en';
    return parquetTypeLabels[supportedLanguage][typeName];
  }

  const words = typeName.toLocaleLowerCase('en').replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
