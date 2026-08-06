'use client';

import { Dropdown } from '@digdir/designsystemet-react';
import { GlobeIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { languageCookieName, localization, type SupportedLanguage, setPreferenceCookie } from '@/libs/language';

// These remain the same across language changes so no need to localize
export const LANGUAGE_LABEL = 'Language/Språk';
export const NB_LABEL = 'Norsk bokmål';
export const NN_LABEL = 'Norsk nynorsk';
export const EN_LABEL = 'English';

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
      <Dropdown.Trigger variant='secondary' onClick={() => setLangOpen(!langOpen)}>
        <GlobeIcon aria-hidden />
        <span>{LANGUAGE_LABEL}</span>
      </Dropdown.Trigger>
      <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => onLanguageChange('nb')}>{NB_LABEL}</Dropdown.Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => onLanguageChange('nn')}>{NN_LABEL}</Dropdown.Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => onLanguageChange('en')}>{EN_LABEL}</Dropdown.Button>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </Dropdown.TriggerContext>
  );
};

export { LanguagePicker };
