import { describe, expect, it } from 'vitest';
import { formatParquetType } from './formatParquetType';

describe('formatParquetType', () => {
  it.each([
    ['BYTE_ARRAY', 'Byte array'],
    ['FIXED_LEN_BYTE_ARRAY', 'Fixed-length byte array'],
    ['DOUBLE', 'Double-precision float'],
    ['INT64', '64-bit integer'],
    ['STRING', 'String'],
    ['UUID', 'UUID'],
    ['CUSTOM_TYPE', 'Custom type'],
  ])('formats %s as %s', (typeName, expected) => {
    expect(formatParquetType(typeName)).toBe(expected);
  });
});
