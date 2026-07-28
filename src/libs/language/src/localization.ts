import LocalizedStrings from 'react-localization';
import { en } from './en';
import { nb, type Translation } from './nb';

export const languageCookieName = 'ssb-dataportal-language';
export const cookieBannerDismissedCookieName = 'ssb-dataportal-cookie-banner-dismissed';
export const preferenceCookieMaxAge = 31536000;

export const supportedLanguages = ['nb', 'en'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return supportedLanguages.includes(value as SupportedLanguage);
};

export const resolveLanguage = (value?: string): SupportedLanguage => {
  return value && isSupportedLanguage(value) ? value : 'nb';
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
  en: en as Translation,
});

localization.setLanguage('nb');
