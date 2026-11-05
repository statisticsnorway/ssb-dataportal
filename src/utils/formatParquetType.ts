const parquetTypeLabels: Record<string, string> = {
  BOOLEAN: 'Boolean',
  BYTE_ARRAY: 'Byte array',
  BSON: 'BSON',
  DATE: 'Date',
  DECIMAL: 'Decimal',
  DOUBLE: 'Double-precision float',
  ENUM: 'Enum',
  FIXED_LEN_BYTE_ARRAY: 'Fixed-length byte array',
  FLOAT: 'Single-precision float',
  FLOAT16: '16-bit float',
  GEOGRAPHY: 'Geography',
  GEOMETRY: 'Geometry',
  INT32: '32-bit integer',
  INT64: '64-bit integer',
  INT96: '96-bit integer',
  INT_8: '8-bit integer',
  INT_16: '16-bit integer',
  INT_32: '32-bit integer',
  INT_64: '64-bit integer',
  INTERVAL: 'Interval',
  JSON: 'JSON',
  LIST: 'List',
  MAP: 'Map',
  STRING: 'String',
  TIME: 'Time',
  TIME_MILLIS: 'Time (milliseconds)',
  TIME_MICROS: 'Time (microseconds)',
  TIMESTAMP: 'Timestamp',
  TIMESTAMP_MILLIS: 'Timestamp (milliseconds)',
  TIMESTAMP_MICROS: 'Timestamp (microseconds)',
  TIMESTAMP_NANOS: 'Timestamp (nanoseconds)',
  UINT_8: '8-bit unsigned integer',
  UINT_16: '16-bit unsigned integer',
  UINT_32: '32-bit unsigned integer',
  UINT_64: '64-bit unsigned integer',
  UNKNOWN: 'Unknown',
  UUID: 'UUID',
  VARIANT: 'Variant',
};

/** Formats Parquet physical and logical type names for display. */
export function formatParquetType(typeName: string): string {
  return (
    parquetTypeLabels[typeName] ??
    typeName
      .toLocaleLowerCase('en')
      .split('_')
      .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
      .join(' ')
  );
}
