'use client';

import { Dropdown } from '@digdir/designsystemet-react';
import { GlobeIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { languageCookieName, localization, type SupportedLanguage, setPreferenceCookie } from '@/libs/language';
import styles from './language-picker.module.css';

// These remain the same across language changes so no need to localize
// fallow-ignore-next-line unused-export
export const LANGUAGE_LABEL = 'Language/Språk';
// fallow-ignore-next-line unused-export
export const NB_LABEL = 'Norsk bokmål';
// fallow-ignore-next-line unused-export
export const NN_LABEL = 'Norsk nynorsk';
// fallow-ignore-next-line unused-export
export const EN_LABEL = 'English';

interface LanguageItem {
  label: string;
  code: SupportedLanguage;
}

const LanguagePicker = () => {
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);

  const onLanguageChange = (language: SupportedLanguage) => {
    localization.setLanguage(language);
    setPreferenceCookie(languageCookieName, language);
    setLangOpen(false);
    router.refresh();
  };

  return (
    <Dropdown.TriggerContext>
      <Dropdown.Trigger variant='secondary'>
        <GlobeIcon aria-hidden />
        <span>{LANGUAGE_LABEL}</span>
      </Dropdown.Trigger>
      <Dropdown
        className={styles.dropdown}
        placement='bottom-end'
        open={langOpen}
        onOpen={() => setLangOpen(true)}
        onClose={() => setLangOpen(false)}
      >
        <Dropdown.List>
          {[
            { label: NB_LABEL, code: 'nb' } satisfies LanguageItem,
            { label: NN_LABEL, code: 'nn' } satisfies LanguageItem,
            { label: EN_LABEL, code: 'en' } satisfies LanguageItem,
          ].map((data: LanguageItem) => (
            <Dropdown.Item key={data.code}>
              <Dropdown.Button className={styles.dropdownButton} onClick={() => onLanguageChange(data.code)}>
                {data.label}
              </Dropdown.Button>
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown>
    </Dropdown.TriggerContext>
  );
};

export { LanguagePicker };
