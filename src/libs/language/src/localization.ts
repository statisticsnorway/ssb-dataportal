import LocalizedStrings from 'react-localization';
import { en } from './en';
import { nb, type Translation } from './nb';

export const languageCookieName = 'ssb-dataportal-language';

export const supportedLanguages = ['nb', 'en'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return supportedLanguages.includes(value as SupportedLanguage);
};

export const resolveLanguage = (value?: string): SupportedLanguage => {
  return value && isSupportedLanguage(value) ? value : 'nb';
};

export const localization = new LocalizedStrings<Translation>({
  nb,
  en: en as Translation,
});

localization.setLanguage('nb');
