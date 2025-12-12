'use client';
import { ClassificationType } from '@/types/classification';
import { areFieldsDefinedAndNonNull, nonEmpty, parseClassification } from '.';
import { Item } from '@/types/item';

describe('areFieldsDefinedAndNonNull filter', () => {
  it('non-null objects pass through', () => {
    expect(
      [{ key1: 'key1' }, { key1: 'key2' }].filter((obj) => areFieldsDefinedAndNonNull(obj, ['key1'])),
    ).toStrictEqual([{ key1: 'key1' }, { key1: 'key2' }]);
  });

  it('null objects filtered', () => {
    expect(
      [{ key1: 'key1' }, null, undefined].filter((obj) => areFieldsDefinedAndNonNull(obj, ['key1'])),
    ).toStrictEqual([{ key1: 'key1' }]);
  });

  it('objects with null fields filtered out', () => {
    expect(
      [
        { key1: 'key1', key2: 'key2' },
        { key1: null, key2: 'key2' },
      ].filter((obj) => areFieldsDefinedAndNonNull(obj, ['key1'])),
    ).toStrictEqual([{ key1: 'key1', key2: 'key2' }]);
  });

  it('objects with missing fields filtered out', () => {
    expect(
      [{ key1: 'key1', key2: 'key2' }, { key1: 'key1' }].filter((obj) =>
        areFieldsDefinedAndNonNull(obj, ['key1', 'key2']),
      ),
    ).toStrictEqual([{ key1: 'key1', key2: 'key2' }]);
  });

  it('objects with undefined fields filtered out', () => {
    expect(
      [{ key1: 'key1' }, { key1: undefined }].filter((obj) => areFieldsDefinedAndNonNull(obj, ['key1'])),
    ).toStrictEqual([{ key1: 'key1' }]);
  });
});

describe('parseClassification', () => {
  const validJson = {
    name: 'Standard for delområde- og grunnkretsinndeling',
    id: 1,
    classificationType: 'Klassifikasjon',
    lastModified: '2025-12-03T10:05:55.000+0000',
    _links: {
      self: {
        href: 'https://data.ssb.no/api/klass/v1/classifications/1',
      },
    },
  };

  const invalidJson = {
    name: 'Standard for delområde- og grunnkretsinndeling',
    classificationType: 'Klassifikasjon',
    lastModified: '2025-12-03T10:05:55.000+0000',
    _links: {
      self: {
        href: 'https://data.ssb.no/api/klass/v1/classifications/1',
      },
    },
  };
  it('returns a parsed classification when given valid input', () => {
    const result = parseClassification(validJson);

    expect(result).toEqual({
      ...validJson,
      classificationType: ClassificationType[validJson.classificationType as keyof typeof ClassificationType],
    });
  });

  it('throws an error when the classification object is missing required fields', () => {
    expect(() => parseClassification(invalidJson)).toThrow('Invalid classification');
  });

  it('throws an error when input is null', () => {
    expect(() => parseClassification(null)).toThrow('Object is null');
  });
});

describe('nonEmpty', () => {
  it('keeps items with a truthy string', () => {
    const items: Item[] = [
      { label: 'A', value: 'hello' },
      { label: 'B', value: '' },
    ];

    expect(nonEmpty(items)).toEqual([{ label: 'A', value: 'hello' }]);
  });

  it('keeps items with non-empty arrays', () => {
    const items: Item[] = [
      { label: 'A', value: ['one'] },
      { label: 'B', value: [] },
    ];

    expect(nonEmpty(items)).toEqual([{ label: 'A', value: ['one'] }]);
  });

  it('filters out null or undefined values', () => {
    const items: Item[] = [
      { label: 'A', value: null as any },
      { label: 'B', value: undefined as any },
      { label: 'C', value: 'ok' },
    ];

    expect(nonEmpty(items)).toEqual([{ label: 'C', value: 'ok' }]);
  });
});



