import { describe, expect, it } from 'vitest';
import { buildUrl } from './urls';

describe('build url', () => {
  describe('classification', () => {
    it('classifications', () => {
      expect(buildUrl({})).toBe('/classifications');
    });
    it('classification ID', () => {
      expect(buildUrl({ classificationId: 2 })).toBe('/classifications/2');
    });
    it.each([
      ['codes', '/classifications/2/codes'],
      ['details', '/classifications/2/details'],
      ['changes', '/classifications/2/changes'],
      ['correspondences', '/classifications/2/correspondences'],
      ['variants', '/classifications/2/variants'],
    ] as const)('%s tab', (tab, expectedUrl) => {
      expect(buildUrl({ classificationId: 2, tab })).toBe(expectedUrl);
    });
  });
  describe('version', () => {
    it('version ID', () => {
      expect(buildUrl({ classificationId: 2, versionId: 2002 })).toBe('/classifications/2/versions/2002');
    });
    it.each([
      ['codes', '/classifications/2/versions/2002/codes'],
      ['details', '/classifications/2/versions/2002/details'],
      ['changes', '/classifications/2/versions/2002/changes'],
      ['correspondences', '/classifications/2/versions/2002/correspondences'],
      ['variants', '/classifications/2/versions/2002/variants'],
    ] as const)('%s tab', (tab, expectedUrl) => {
      expect(buildUrl({ classificationId: 2, versionId: 2002, tab })).toBe(expectedUrl);
    });
    it('correspondence ID', () => {
      expect(buildUrl({ classificationId: 2, versionId: 2002, correspondenceId: 547 })).toBe(
        '/classifications/2/versions/2002/correspondences/547',
      );
    });
    it('variant ID', () => {
      expect(buildUrl({ classificationId: 2, versionId: 2002, variantId: 64 })).toBe(
        '/classifications/2/versions/2002/variants/64',
      );
    });
  });
  describe('error cases', () => {
    it('no classification ID', () => {
      expect(() => buildUrl({ versionId: 2002 })).toThrow(Error('No classification ID supplied'));
      expect(() => buildUrl({ versionId: 2002, tab: 'changes' })).toThrow(Error('No classification ID supplied'));
      expect(() => buildUrl({ versionId: 2002, variantId: 64 })).toThrow(Error('No classification ID supplied'));
    });
    it('doubled IDs', () => {
      expect(() => buildUrl({ variantId: 64, correspondenceId: 547 })).toThrow(
        Error("Can't supply correspondence and variant ID together"),
      );
    });
  });
});
