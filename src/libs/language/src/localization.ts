import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { nb } from './nb';

interface LocaleStrings extends LocalizedStringsMethods {
  // biome-ignore lint/suspicious/noExplicitAny: Value may be a string or an object
  [key: string]: any;
}

export const localization: LocaleStrings = new LocalizedStrings({
  nb: {
    ...nb,
  },
});

localization.setLanguage('nb');
