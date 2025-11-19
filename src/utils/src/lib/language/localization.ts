import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { nb } from './nb';

interface LocaleStrings extends LocalizedStringsMethods {
  // TODO: fix any type
  // biome-ignore lint/suspicious/noExplicitAny: <Copied from catalog-frontend - must find out why any is used>
  [key: string]: any;
}

export const localization: LocaleStrings = new LocalizedStrings({
  nb: {
    ...nb,
  },
});

localization.setLanguage('nb');
