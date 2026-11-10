import type { LogicalTypeKind, PhysicalType } from '@/libs/data-access/datadoc';
import type { SupportedLanguage } from '@/libs/language';

/** Exhaustive over the generated enums, so a type added to the Datadoc spec fails to compile until it is labelled. */
const parquetTypeLabels: Record<PhysicalType | LogicalTypeKind, Record<SupportedLanguage, string>> = {
  BOOLEAN: { en: 'Boolean', nb: 'Boolsk verdi', nn: 'Boolsk verdi' },
  INT32: { en: '32-bit integer', nb: '32-bits heltall', nn: '32-bits heiltal' },
  INT64: { en: '64-bit integer', nb: '64-bits heltall', nn: '64-bits heiltal' },
  INT96: { en: '96-bit integer', nb: '96-bits heltall', nn: '96-bits heiltal' },
  FLOAT: { en: 'Single-precision float', nb: '32-bits flyttall', nn: '32-bits flyttal' },
  DOUBLE: { en: 'Double-precision float', nb: '64-bits flyttall', nn: '64-bits flyttal' },
  BYTE_ARRAY: { en: 'Byte array', nb: 'Bytearray', nn: 'Bytearray' },
  FIXED_LEN_BYTE_ARRAY: {
    en: 'Fixed-length byte array',
    nb: 'Bytearray med fast lengde',
    nn: 'Bytearray med fast lengd',
  },
  STRING: { en: 'String', nb: 'Streng', nn: 'Streng' },
  ENUM: { en: 'Enum', nb: 'Enum', nn: 'Enum' },
  JSON: { en: 'JSON', nb: 'JSON', nn: 'JSON' },
  BSON: { en: 'BSON', nb: 'BSON', nn: 'BSON' },
  UUID: { en: 'UUID', nb: 'UUID', nn: 'UUID' },
  DATE: { en: 'Date', nb: 'Dato', nn: 'Dato' },
  DECIMAL: { en: 'Decimal', nb: 'Desimaltall', nn: 'Desimaltal' },
  INTEGER: { en: 'Integer', nb: 'Heltall', nn: 'Heiltal' },
  TIME: { en: 'Time', nb: 'Tid', nn: 'Tid' },
  TIMESTAMP: { en: 'Timestamp', nb: 'Tidsstempel', nn: 'Tidsstempel' },
  FLOAT16: { en: '16-bit float', nb: '16-bits flyttall', nn: '16-bits flyttal' },
  LIST: { en: 'List', nb: 'Liste', nn: 'Liste' },
  MAP: { en: 'Map', nb: 'Map', nn: 'Map' },
  UNKNOWN: { en: 'Unknown', nb: 'Ukjent', nn: 'Ukjend' },
  VARIANT: { en: 'Variant', nb: 'Variant', nn: 'Variant' },
  GEOMETRY: { en: 'Geometry', nb: 'Geometri', nn: 'Geometri' },
  GEOGRAPHY: { en: 'Geography', nb: 'Geografi', nn: 'Geografi' },
  INTERVAL: { en: 'Interval', nb: 'Intervall', nn: 'Intervall' },
};

function isKnownType(typeName: string): typeName is keyof typeof parquetTypeLabels {
  return Object.hasOwn(parquetTypeLabels, typeName);
}

/** Formats a Parquet physical or logical type name for display. Datadoc types the names as plain strings. */
export function formatParquetType(typeName: string, language: string = 'en'): string {
  if (isKnownType(typeName)) {
    const supportedLanguage: SupportedLanguage = language === 'nb' || language === 'nn' ? language : 'en';
    return parquetTypeLabels[typeName][supportedLanguage];
  }

  const words = typeName.toLocaleLowerCase('en').replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
