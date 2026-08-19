import LocalizedStrings from 'react-localization';
import { en } from './en';
import { nb, type Translation } from './nb';
import { nn } from './nn';

export const languageCookieName = 'ssb-dataportal-language';
export const cookieBannerDismissedCookieName = 'ssb-dataportal-cookie-banner-dismissed';
const preferenceCookieMaxAge = 31536000;

export const supportedLanguages = ['nb', 'nn', 'en'] as const;
export const klassLanguages = ['NB', 'NN', 'EN'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];
export type KlassLanguage = (typeof klassLanguages)[number];

export function toKlassLanguage(language: SupportedLanguage): KlassLanguage {
  return language.toUpperCase() as KlassLanguage;
}

export const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return supportedLanguages.includes(value as SupportedLanguage);
};

const bokmalLocalePrefixes = ['nb', 'no', 'da', 'sv'];

export const resolveLanguageFromLocale = (locale?: string): SupportedLanguage => {
  if (!locale) {
    return 'en';
  }

  const locales = locale
    .split(',')
    .map((part) => part.trim().split(';')[0]?.toLowerCase())
    .filter((part): part is string => Boolean(part));

  if (locales.some((part) => part === 'nn' || part.startsWith('nn-'))) {
    return 'nn';
  }

  if (locales.some((part) => bokmalLocalePrefixes.some((prefix) => part === prefix || part.startsWith(`${prefix}-`)))) {
    return 'nb';
  }

  return 'en';
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
