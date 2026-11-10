import { describe, expect, it } from 'vitest';
import { formatParquetType } from './formatParquetType';

describe('formatParquetType', () => {
  it.each([
    ['en', '32-bit integer'],
    ['nb', '32-bits heltall'],
    ['nn', '32-bits heiltal'],
    ['unsupported', '32-bit integer'],
  ])('uses the %s translation with English fallback', (language, expected) => {
    expect(formatParquetType('INT32', language)).toBe(expected);
  });

  it.each([
    ['BYTE_ARRAY', 'Byte array'],
    ['FIXED_LEN_BYTE_ARRAY', 'Fixed-length byte array'],
    ['DOUBLE', 'Double-precision float'],
    ['INT64', '64-bit integer'],
    ['STRING', 'String'],
    ['INTEGER', 'Integer'],
    ['UUID', 'UUID'],
    ['constructor', 'Constructor'],
    ['CUSTOM_TYPE', 'Custom type'],
  ])('formats %s as %s', (typeName, expected) => {
    expect(formatParquetType(typeName)).toBe(expected);
  });
});
