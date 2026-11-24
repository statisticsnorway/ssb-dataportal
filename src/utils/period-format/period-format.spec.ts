/** biome-ignore-all lint/suspicious/noExplicitAny: Allow using 'any' for testing invalid period format */
import { describe, expect, it } from 'vitest';
import { getPeriodFormatLabel } from '.';

describe('map period format', () => {
  it('YEAR_MONTH', () => {
    const result = getPeriodFormatLabel('YEAR_MONTH');
    expect(result).toBe('Månedlig');
  });
  it('YEAR_WEEK', () => {
    const result = getPeriodFormatLabel('YEAR_WEEK');
    expect(result).toBe('Ukentlig');
  });
  it('YEAR_MONTH_DAY', () => {
    const result = getPeriodFormatLabel('YEAR_MONTH_DAY');
    expect(result).toBe('Daglig');
  });
  it('YEAR', () => {
    const result = getPeriodFormatLabel('YEAR');
    expect(result).toBe('Årlig');
  });
  it('BIMESTER', () => {
    const result = getPeriodFormatLabel('BIMESTER');
    expect(result).toBe('Annenhver måned');
  });
  it('HALF_YEAR', () => {
    const result = getPeriodFormatLabel('HALF_YEAR');
    expect(result).toBe('Halvårlig');
  });
  it('TRIANNUAL', () => {
    const result = getPeriodFormatLabel('TRIANNUAL');
    expect(result).toBe('Tertialvis');
  });
  it('QUARTER', () => {
    const result = getPeriodFormatLabel('QUARTER');
    expect(result).toBe('Kvartalsvis');
  });
});

describe('invalid period format', () => {
  it('should return undefined for an invalid period format', () => {
    const result = getPeriodFormatLabel('INVALID_FORMAT' as any);
    expect(result).toBeUndefined();
  });
  it('should return undefined for null', () => {
    const result = getPeriodFormatLabel(null as any);
    expect(result).toBeUndefined();
  });
});