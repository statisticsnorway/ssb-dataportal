import { describe, expect, it } from 'vitest';
import type { CodeChangeItem } from '@/libs/data-access/klass';
import { groupChanges } from './changes';

const changes: CodeChangeItem[] = [
  { oldCode: '01', oldName: 'Oslo (gammel)', newCode: '0301', newName: 'Oslo', changeOccurred: new Date('2020-01-01') },
  { oldCode: '02', oldName: 'Akershus', newCode: '3000', newName: 'Viken', changeOccurred: new Date('2020-01-01') },
  { oldCode: '06', oldName: 'Buskerud', newCode: '3000', newName: 'Viken', changeOccurred: new Date('2020-01-01') },
  {
    oldCode: '3000',
    oldName: 'Viken',
    newCode: '32',
    newName: 'Akershus (ny)',
    changeOccurred: new Date('2024-01-01'),
  },
  {
    oldCode: '3000',
    oldName: 'Viken',
    newCode: '33',
    newName: 'Buskerud (ny)',
    changeOccurred: new Date('2024-01-01'),
  },
];

describe('groupChanges', () => {
  describe('non-inverted (group by newCode)', () => {
    it('groups changes with the same newCode together', () => {
      const result = groupChanges(changes, false);

      expect(result).toHaveLength(4);
      expect(result.map((g) => g.newCodeKey)).toEqual(['0301', '3000', '32', '33']);

      const vikenGroup = result.find((g) => g.newCodeKey === '3000');
      expect(vikenGroup?.changes).toHaveLength(2);
      expect(vikenGroup?.changes.map((c) => c.oldCode)).toEqual(['02', '06']);
    });

    it('preserves insertion order of groups', () => {
      const result = groupChanges(changes, false);
      expect(result[0]?.newCodeKey).toBe('0301');
    });

    it('uses fallback key when newCode is missing', () => {
      const result = groupChanges([{ oldCode: '01', oldName: 'X' }] as CodeChangeItem[], false);
      expect(result[0]?.newCodeKey).toBe('__undefined_new_code__');
    });
  });

  describe('inverted (group by oldCode)', () => {
    it('groups changes with the same oldCode together', () => {
      const result = groupChanges(changes, true);

      expect(result).toHaveLength(4);
      expect(result.map((g) => g.newCodeKey)).toEqual(['01', '02', '06', '3000']);

      const vikenGroup = result.find((g) => g.newCodeKey === '3000');
      expect(vikenGroup?.changes).toHaveLength(2);
      expect(vikenGroup?.changes.map((c) => c.newCode)).toEqual(['32', '33']);
    });

    it('uses fallback key when oldCode is missing', () => {
      const result = groupChanges([{ newCode: '01', newName: 'X' }] as CodeChangeItem[], true);
      expect(result[0]?.newCodeKey).toBe('__undefined_old_code__');
    });
  });

  it('returns empty array for empty input', () => {
    expect(groupChanges([], false)).toEqual([]);
    expect(groupChanges([], true)).toEqual([]);
  });

  it('handles a single change', () => {
    const result = groupChanges([changes[0] as CodeChangeItem], false);
    expect(result).toEqual([{ newCodeKey: '0301', changes: [changes[0]] }]);
  });
});
