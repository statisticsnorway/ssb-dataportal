import { describe, expect, it } from 'vitest';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { classificationDetailsTabsData, getClassificationDetailsTabForRoute } from './tabs';

describe('getClassificationDetailsTabForRoute', () => {
  it.each([
    buildUrl({ classificationId: 104, tab: 'variants' }),
    buildUrl({ classificationId: 104, variantId: 3453 }),
    buildUrl({ classificationId: 104, versionId: 1709, tab: 'variants' }),
    buildUrl({ classificationId: 104, versionId: 1709, variantId: 3452 }),
  ])('selects the variants tab for %s', (pathname) => {
    expect(getClassificationDetailsTabForRoute(pathname)).toBe(classificationDetailsTabsData.Variants);
  });

  it('selects a tab from its terminal route segment', () => {
    expect(
      getClassificationDetailsTabForRoute(buildUrl({ classificationId: 104, versionId: 1709, tab: 'details' })),
    ).toBe(classificationDetailsTabsData.Details);
  });

  it('does not match partial route segment names', () => {
    expect(getClassificationDetailsTabForRoute('/classifications/104/variant-summary')).toBeUndefined();
  });
});
