import type { LogicalTypeKind, PhysicalType } from '@/libs/data-access/datadoc';

/** Exhaustive over the generated enums, so a type added to the Datadoc spec fails to compile until it is labelled. */
const parquetTypeLabels: Record<PhysicalType | LogicalTypeKind, string> = {
  BOOLEAN: 'Boolean',
  INT32: '32-bit integer',
  INT64: '64-bit integer',
  INT96: '96-bit integer',
  FLOAT: 'Single-precision float',
  DOUBLE: 'Double-precision float',
  BYTE_ARRAY: 'Byte array',
  FIXED_LEN_BYTE_ARRAY: 'Fixed-length byte array',
  STRING: 'String',
  ENUM: 'Enum',
  JSON: 'JSON',
  BSON: 'BSON',
  UUID: 'UUID',
  DATE: 'Date',
  DECIMAL: 'Decimal',
  INTEGER: 'Integer',
  TIME: 'Time',
  TIMESTAMP: 'Timestamp',
  FLOAT16: '16-bit float',
  LIST: 'List',
  MAP: 'Map',
  UNKNOWN: 'Unknown',
  VARIANT: 'Variant',
  GEOMETRY: 'Geometry',
  GEOGRAPHY: 'Geography',
  INTERVAL: 'Interval',
};

function isKnownType(typeName: string): typeName is keyof typeof parquetTypeLabels {
  return Object.hasOwn(parquetTypeLabels, typeName);
}

/** Formats a Parquet physical or logical type name for display. Datadoc types the names as plain strings. */
export function formatParquetType(typeName: string): string {
  if (isKnownType(typeName)) return parquetTypeLabels[typeName];

  const words = typeName.toLocaleLowerCase('en').replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
