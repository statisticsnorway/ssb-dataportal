import { describe, expect, it } from 'vitest';
import { classificationDetailsTabsData, getClassificationDetailsTabForRoute } from './tabs';

describe('getClassificationDetailsTabForRoute', () => {
  it.each([
    '/classifications/104/variants',
    '/classifications/104/variants/3453',
    '/classifications/104/versions/1709/variants',
    '/classifications/104/versions/1709/variants/3452',
  ])('selects the variants tab for %s', (pathname) => {
    expect(getClassificationDetailsTabForRoute(pathname)).toBe(classificationDetailsTabsData.Variants);
  });

  it('selects a tab from its terminal route segment', () => {
    expect(getClassificationDetailsTabForRoute('/classifications/104/versions/1709/details')).toBe(
      classificationDetailsTabsData.Details,
    );
  });

  it('does not match partial route segment names', () => {
    expect(getClassificationDetailsTabForRoute('/classifications/104/variant-summary')).toBeUndefined();
  });
});
