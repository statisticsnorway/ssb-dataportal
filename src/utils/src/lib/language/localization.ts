import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { datasetFormNb } from './dataset.form.nb';
import { nb } from './nb';

interface LocaleStrings extends LocalizedStringsMethods {
  // biome-ignore lint/suspicious/noExplicitAny: <Copied from catalog-frontend - must find out why any is used>
  [key: string]: any;
}

export const localization: LocaleStrings = new LocalizedStrings({
  nb: {
    ...nb,
    datasetForm: { ...datasetFormNb },
  },
});

localization.setLanguage('nb');
