import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { datasetFormNb } from './dataset.form.nb';
import { nb } from './nb';

interface LocaleStrings extends LocalizedStringsMethods {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const localization: LocaleStrings = new LocalizedStrings({
  nb: {
    ...nb,
    datasetForm: { ...datasetFormNb },
  },
});

localization.setLanguage('nb');
