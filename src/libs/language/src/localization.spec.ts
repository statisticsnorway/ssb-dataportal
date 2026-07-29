import { describe, expect, it } from 'vitest';
import { resolveLanguage, resolveLanguageFromLocale } from './localization';

describe('resolveLanguageFromLocale', () => {
  it('returns nynorsk when locale is Nynorsk', () => {
    expect(resolveLanguageFromLocale('nn-NO')).toBe('nn');
  });

  it('returns bokmal when locale is Bokmal, Danish or Swedish', () => {
    expect(resolveLanguageFromLocale('nb-NO')).toBe('nb');
    expect(resolveLanguageFromLocale('da-DK')).toBe('nb');
    expect(resolveLanguageFromLocale('sv-SE')).toBe('nb');
  });

  it('returns english for all other locales', () => {
    expect(resolveLanguageFromLocale('en-GB')).toBe('en');
    expect(resolveLanguageFromLocale('de-DE')).toBe('en');
  });

  it('parses Accept-Language and prioritizes Nynorsk', () => {
    expect(resolveLanguageFromLocale('en-US,en;q=0.9,nn-NO;q=0.8')).toBe('nn');
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
