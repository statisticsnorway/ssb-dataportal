import { describe, expect, it } from 'vitest';
import { isVersionValidOnDate, resolveDefaultVersion } from './versionSelection';

describe('versionSelection', () => {
  describe('isVersionValidOnDate', () => {
    it('returns true when date is within validFrom/validTo range (inclusive)', () => {
      const version = {
        validFrom: new Date('2025-01-01T15:00:00'),
        validTo: new Date('2025-12-31T01:00:00'),
      };

      expect(isVersionValidOnDate(version, new Date('2025-01-01T00:00:00'))).toBe(true);
      expect(isVersionValidOnDate(version, new Date('2025-12-31T23:59:59'))).toBe(true);
    });

    it('returns false when date is before validFrom or after validTo', () => {
      const version = {
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
      };

      expect(isVersionValidOnDate(version, new Date('2024-12-31'))).toBe(false);
      expect(isVersionValidOnDate(version, new Date('2026-01-01'))).toBe(false);
    });
  });

  describe('resolveDefaultVersion', () => {
    it('picks the version valid on target date', () => {
      const versions = [
        { id: 10, validFrom: new Date('2020-01-01'), validTo: new Date('2024-12-31') },
        { id: 20, validFrom: new Date('2025-01-01'), validTo: new Date('2026-12-31') },
        { id: 30, validFrom: new Date('2030-01-01') },
      ];

      const result = resolveDefaultVersion(versions, new Date('2026-06-15'));

      expect(result?.id).toBe(20);
    });

    it('falls back to latest version before target date when none are valid on date', () => {
      const versions = [
        { id: 10, validFrom: new Date('2020-01-01'), validTo: new Date('2024-12-31') },
        { id: 20, validFrom: new Date('2025-01-01'), validTo: new Date('2025-12-31') },
        { id: 30, validFrom: new Date('2030-01-01') },
      ];

      const result = resolveDefaultVersion(versions, new Date('2026-06-15'));

      expect(result?.id).toBe(20);
    });
  });
});
