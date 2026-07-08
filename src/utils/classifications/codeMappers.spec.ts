import { describe, expect, it } from 'vitest';
import type { ClassificationItemResource } from '@/libs/data-access/klass/models/ClassificationItemResource';
import { mapClassificationItemToKlassCode } from './codeMappers';

describe('mapClassificationItemToKlassCode', () => {
  it('maps all populated fields correctly', () => {
    const item: ClassificationItemResource = {
      code: '01',
      parentCode: 'A',
      level: '2',
      name: 'Jordbruk',
      shortName: 'JB',
      notes: 'Some notes',
      validFrom: new Date('2008-01-01T00:00:00.000Z'),
      validTo: new Date('2020-12-31T00:00:00.000Z'),
    };

    expect(mapClassificationItemToKlassCode(item)).toEqual({
      code: '01',
      parentCode: 'A',
      level: '2',
      name: 'Jordbruk',
      shortName: 'JB',
      notes: 'Some notes',
      validFrom: '2008-01-01',
      validTo: '2020-12-31',
    });
  });

  it('falls back to empty string for missing code, level, name and validFrom', () => {
    const item: ClassificationItemResource = {};

    const result = mapClassificationItemToKlassCode(item);

    expect(result.code).toBe('');
    expect(result.level).toBe('1');
    expect(result.name).toBe('');
    expect(result.validFrom).toBe('');
  });

  it('maps parentCode undefined to null', () => {
    const item: ClassificationItemResource = { code: 'A', level: '1', name: 'Root', validFrom: new Date('2000-01-01') };

    expect(mapClassificationItemToKlassCode(item).parentCode).toBeNull();
  });

  it('leaves optional shortName, validTo and notes as undefined when absent', () => {
    const item: ClassificationItemResource = {
      code: 'B',
      level: '1',
      name: 'Bergverksdrift',
      validFrom: new Date('2008-01-01'),
    };

    const result = mapClassificationItemToKlassCode(item);

    expect(result.shortName).toBeUndefined();
    expect(result.validTo).toBeUndefined();
    expect(result.notes).toBeUndefined();
  });

  it('slices the validFrom and validTo ISO string to the date part only', () => {
    const item: ClassificationItemResource = {
      code: 'C',
      level: '1',
      name: 'Industri',
      validFrom: new Date('2008-06-15T12:34:56.000Z'),
      validTo: new Date('2023-03-31T23:59:59.000Z'),
    };

    const result = mapClassificationItemToKlassCode(item);

    expect(result.validFrom).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.validTo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
