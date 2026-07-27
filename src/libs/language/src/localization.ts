import LocalizedStrings from 'react-localization';
import { en } from './en';
import { nb, type Translation } from './nb';

export const localization = new LocalizedStrings<Translation>({
  nb,
  en: en as Translation,
});

// Default language. Expected to be overridden by user preferences at runtime
localization.setLanguage('nb');
