'use client';

import { Dropdown } from '@digdir/designsystemet-react';
import { GlobeIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { languageCookieName, localization, type SupportedLanguage, setPreferenceCookie } from '@/libs/language';
import { EN_LABEL, LANGUAGE_LABEL, NB_LABEL, NN_LABEL } from './constants';
import styles from './language-picker.module.css';

interface LanguageItem {
  label: string;
  code: SupportedLanguage;
}

const LANGUAGE_ITEMS: LanguageItem[] = [
  { label: NB_LABEL, code: 'nb' },
  { label: NN_LABEL, code: 'nn' },
  { label: EN_LABEL, code: 'en' },
];

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
          {LANGUAGE_ITEMS.map((data) => (
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
