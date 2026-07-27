'use client';

import { Dropdown } from '@digdir/designsystemet-react';
import { LanguageIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { languageCookieName, localization, type SupportedLanguage } from '@/libs/language';

const LanguagePicker = () => {
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);

  const onLanguageChange = (language: SupportedLanguage) => {
    localization.setLanguage(language);
    document.cookie = `${languageCookieName}=${language}; path=/; max-age=31536000; samesite=lax`;
    setLangOpen(false);
    router.refresh();
  };

  return (
    <Dropdown.TriggerContext>
      <Dropdown.Trigger onClick={() => setLangOpen(!langOpen)}>
        <LanguageIcon aria-hidden />
        <span>{localization.language.label}</span>
      </Dropdown.Trigger>
      <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => onLanguageChange('nb')}>{localization.language.nb}</Dropdown.Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => onLanguageChange('en')}>{localization.language.en}</Dropdown.Button>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </Dropdown.TriggerContext>
  );
};

export { LanguagePicker };
