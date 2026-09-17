import LocalizedStrings from 'react-localization';
import { en } from './en';
import { nb, type Translation } from './nb';
import { nn } from './nn';

export const languageCookieName = 'ssb-dataportal-language';
export const cookieBannerDismissedCookieName = 'ssb-dataportal-cookie-banner-dismissed';
const preferenceCookieMaxAge = 31536000;

export const supportedLanguages = ['nb', 'nn', 'en'] as const;
const klassLanguages = ['NB', 'NN', 'EN'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];
export type KlassLanguage = (typeof klassLanguages)[number];

export function toKlassLanguage(language: SupportedLanguage): KlassLanguage {
  return language.toUpperCase() as KlassLanguage;
}

export const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return supportedLanguages.includes(value as SupportedLanguage);
};

const bokmalLocalePrefixes = ['nb', 'no', 'da', 'sv'];

interface ParsedLocale {
  locale: string;
  quality: number;
  index: number;
}

const parseLocalePart = (part: string, index: number): ParsedLocale | undefined => {
  const [rawLocale, ...params] = part.trim().split(';');
  const locale = rawLocale?.toLowerCase();

  if (!locale) {
    return undefined;
  }

  const qualityParam = params.find((param) => param.trim().startsWith('q='));
  const parsedQuality = qualityParam ? Number(qualityParam.trim().slice(2)) : 1;
  const quality = Number.isFinite(parsedQuality) ? Math.max(0, Math.min(1, parsedQuality)) : 1;

  return { locale, quality, index };
};

const isBokmalLocale = (locale: string) => {
  return bokmalLocalePrefixes.some((prefix) => locale === prefix || locale.startsWith(`${prefix}-`));
};

const isNynorskLocale = (locale: string) => {
  return locale === 'nn' || locale.startsWith('nn-');
};

const isEnglishLocale = (locale: string) => {
  return locale === 'en' || locale.startsWith('en-');
};

const toSupportedLanguage = (locale: string): SupportedLanguage | undefined => {
  if (isNynorskLocale(locale)) {
    return 'nn';
  }

  if (isBokmalLocale(locale)) {
    return 'nb';
  }

  if (isEnglishLocale(locale)) {
    return 'en';
  }

  return undefined;
};

export const resolveLanguageFromLocale = (locale?: string): SupportedLanguage => {
  if (!locale) {
    return 'en';
  }

  const bestMatch = locale
    .split(',')
    .map((part, index) => parseLocalePart(part, index))
    .filter((part): part is ParsedLocale => part !== undefined)
    .map((part) => ({
      ...part,
      language: toSupportedLanguage(part.locale),
    }))
    .filter((part): part is ParsedLocale & { language: SupportedLanguage } => part.language !== undefined)
    .sort((a, b) => b.quality - a.quality || a.index - b.index)[0];

  return bestMatch?.language ?? 'en';
};

export const resolveLanguage = (value?: string, locale?: string): SupportedLanguage => {
  if (value && isSupportedLanguage(value)) {
    return value;
  }

  return resolveLanguageFromLocale(locale);
};

export const getCookieValue = (name: string) => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const cookie = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`));

  return cookie?.slice(name.length + 1);
};

export const setPreferenceCookie = (name: string, value: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=${value}; path=/; max-age=${preferenceCookieMaxAge}; samesite=lax`;
};

export const localization = new LocalizedStrings<Translation>({
  nb,
  nn: nn as Translation,
  en: en as Translation,
});

localization.setLanguage('nb');
