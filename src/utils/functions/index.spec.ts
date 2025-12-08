'use client';
import { describe, expect, it } from '@jest/globals';
import { fieldsNotNull } from '.';

describe('fields not null filter', () => {
  it('non-null objects pass through', () => {
    expect([{ key1: 'key1' }, { key1: 'key2' }].filter(fieldsNotNull)).toStrictEqual([
      { key1: 'key1' },
      { key1: 'key2' },
    ]);
  });

  it('objects with null fields filtered out', () => {
    expect(
      [
        { key1: 'key1', key2: 'key2' },
        { key1: null, key2: 'key2' },
      ].filter(fieldsNotNull),
    ).toStrictEqual([{ key1: 'key1', key2: 'key2' }]);
  });

  it('objects with undefined fields filtered out', () => {
    expect([{ key1: 'key1' }, { key1: undefined }].filter(fieldsNotNull)).toStrictEqual([{ key1: 'key1' }]);
  });
});
