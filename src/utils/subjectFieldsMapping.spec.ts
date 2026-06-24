import { describe, expect, it } from 'vitest';
import { getSubjectCodeByFamilyId } from './subjectFieldsMapping';

describe('getSubjectCodeByFamilyId', () => {
  it('returns undefined when familyId is undefined', () => {
    expect(getSubjectCodeByFamilyId(undefined)).toBeUndefined();
  });

  it('returns the correct subject code for a known family id', () => {
    expect(getSubjectCodeByFamilyId(1)).toBe('al');
    expect(getSubjectCodeByFamilyId(2)).toBe('bf');
    expect(getSubjectCodeByFamilyId(25)).toBe('zm');
    expect(getSubjectCodeByFamilyId(7)).toBe('if');
    expect(getSubjectCodeByFamilyId(10)).toBe('kf');
  });

  it('returns the correct code for a family id mapped to multiple codes', () => {
    // be maps to [3, 8]
    expect(getSubjectCodeByFamilyId(3)).toBe('be');
    expect(getSubjectCodeByFamilyId(8)).toBe('be');
  });

  it('returns "15" for the synthetic Region family', () => {
    expect(getSubjectCodeByFamilyId(15)).toBe('15');
  });

  it('returns undefined for an unknown family id', () => {
    expect(getSubjectCodeByFamilyId(999)).toBeUndefined();
  });
});
