'use client';
import { ClassificationType } from '@/types/classification';
import { areFieldsDefinedAndNonNull, parseClassification } from '.';

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

  it('parses a valid classification object', () => {
    const result = parseClassification(validJson);

    expect(result).toEqual({
      ...validJson,
      classificationType: ClassificationType[validJson.classificationType as keyof typeof ClassificationType],
    });
  });
});
