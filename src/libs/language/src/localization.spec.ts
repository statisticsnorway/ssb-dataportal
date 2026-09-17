import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    warn: vi.fn(),
  }),
}));

const { resolveLanguage, resolveLanguageFromLocale } = await import('./localization');

describe('resolveLanguageFromLocale', () => {
  it.each([
    { locale: 'nn-NO', expected: 'nn' },
    { locale: 'nb-NO', expected: 'nb' },
    { locale: 'da-DK', expected: 'nb' },
    { locale: 'sv-SE', expected: 'nb' },
    { locale: 'en-GB', expected: 'en' },
    { locale: 'de-DE', expected: 'en' },
    { locale: 'en-US,en;q=0.9,nn-NO;q=0.8', expected: 'en' },
    { locale: 'en-US,en;q=0.9,nb-NO;q=0.8,nn-NO;q=0.8', expected: 'en' },
    { locale: 'nn,nb;q=0.9,no;q=0.8,en-US;q=0.7,en;q=0.6', expected: 'nn' },
    { locale: 'nn;q=0.7,nb-NO;q=0.9,en;q=0.6', expected: 'nb' },
  ] as const)('resolves $expected from "$locale"', ({ locale, expected }) => {
    expect(resolveLanguageFromLocale(locale)).toBe(expected);
  });
});

describe('resolveLanguage', () => {
  it('uses supported cookie language when present', () => {
    expect(resolveLanguage('nn', 'en-US')).toBe('nn');
  });

  it('falls back to locale when cookie language is missing or unsupported', () => {
    expect(resolveLanguage(undefined, 'sv-SE')).toBe('nb');
    expect(resolveLanguage('fr', 'de-DE')).toBe('en');
  });
});
