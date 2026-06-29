/** biome-ignore-all lint/suspicious/noExplicitAny: <Necessary for testing> */
import { describe, expect, it, vi } from 'vitest';
import { KlassReference } from '@/libs/data-access/variable-definitions/internal';
import { Item } from '@/types/item';
import { getSubjectFieldFilterItems } from '../mock-data';
import { areFieldsDefinedAndNonNull, getLabelByCode, getLabelWithParent, getParentCode, nonEmpty } from '.';
import * as labelModule from './';

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

describe('Extract code item parent code', () => {
  it('extracts parent code', () => {
    expect(getParentCode('al03')).toEqual('al');
  });
  it('returns parent code unchanged', () => {
    expect(getParentCode('al')).toEqual('al');
  });
  it('throws if empty string is provided', () => {
    expect(() => getParentCode(' ')).toThrow('Code cannot be empty');
  });

  it('code is null', () => {
    expect(() => getParentCode(null as any)).toThrow('Code cannot be empty');
  });
  it('code is undefined', () => {
    expect(() => getParentCode(undefined as any)).toThrow('Code cannot be empty');
  });
});

describe('Get label by code', () => {
  it('returns label', () => {
    expect(getLabelByCode('al', getSubjectFieldFilterItems)).toEqual('Arbeid og lønn');
  });
  it('empty code returns empty label', () => {
    expect(getLabelByCode('', getSubjectFieldFilterItems)).toEqual('');
  });
  it('null code returns empty label', () => {
    expect(getLabelByCode(null as any, getSubjectFieldFilterItems)).toEqual('');
  });
  it('undefined code returns empty label', () => {
    expect(getLabelByCode(undefined as any, getSubjectFieldFilterItems)).toEqual('');
  });
});

describe('Get label with parent', () => {
  const mockKlassReferenceParent: KlassReference = {
    reference_uri: 'https://data.ssb.no/api/klass/v1',
    code: 'al',
    title: 'Arbeid og lønn',
  };
  const mockKlassReferenceChild: KlassReference = {
    reference_uri: 'https://data.ssb.no/api/klass/v1',
    code: 'al03',
    title: 'Arbeidsledighet',
  };
  it('returns label', () => {
    expect(getLabelWithParent(mockKlassReferenceParent, getSubjectFieldFilterItems)).toEqual('Arbeid og lønn');
  });
  it('returns label with parent', () => {
    expect(getLabelWithParent(mockKlassReferenceChild, getSubjectFieldFilterItems)).toEqual(
      'Arbeid og lønn → Arbeidsledighet',
    );
  });

  it('returns only the child title when parent label is missing', () => {
    vi.spyOn(labelModule, 'getLabelByCode').mockReturnValueOnce('');

    const result = getLabelWithParent(mockKlassReferenceChild, []);
    expect(result).toBe('Arbeidsledighet');
  });
});
