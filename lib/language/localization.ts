import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { nb } from './nb';
import { datasetFormNb } from './dataset.form.nb';

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
