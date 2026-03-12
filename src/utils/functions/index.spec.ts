'use client';
import { describe, expect, it } from 'vitest';
import { ClassificationResource } from '@/libs/data-access/klass';
import { ClassificationType } from '@/types/classification';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, extractSubjectAreaCode, nonEmpty, parseClassification } from '.';

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

    const expected: ClassificationResource = {
      id: validJson.id,
      name: validJson.name,
      classificationType: ClassificationType[validJson.classificationType as keyof typeof ClassificationType],
      lastModified: new Date(validJson.lastModified),
      links: validJson._links,
    };

    expect(result).toEqual(expected);
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
      { label: 'A', value: null },
      { label: 'B', value: undefined },
      { label: 'C', value: 'ok' },
    ];

    expect(nonEmpty(items)).toEqual([{ label: 'C', value: 'ok' }]);
  });
});

describe('Extract subject area parent code', () => {
  it('extracts parent code', () => {
    expect(extractSubjectAreaCode('al03')).toEqual('al');
  });
  it('returns parent code unchanged', () => {
    expect(extractSubjectAreaCode('al')).toEqual('al');
  });
  it('throws if empty string is provided', () => {
    expect(() => extractSubjectAreaCode(' ')).toThrowError('Subject area code cannot be empty');
  });

  it('code is null', () => {
    // biome-ignore lint/suspicious/noExplicitAny: necessary for testing
    expect(() => extractSubjectAreaCode(null as any)).toThrow('Subject area code cannot be empty');
  });
  it('code is undefined', () => {
    // biome-ignore lint/suspicious/noExplicitAny: necessary for testing
    expect(() => extractSubjectAreaCode(undefined as any)).toThrow('Subject area code cannot be empty');
  });
});
