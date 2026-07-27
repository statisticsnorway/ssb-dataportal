'use client';

import { Dropdown } from '@digdir/designsystemet-react';
import { LanguageIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { localization } from '@/libs/language';

const LanguagePicker = () => {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <Dropdown.TriggerContext>
      <Dropdown.Trigger onClick={() => setLangOpen(!langOpen)}>
        <LanguageIcon aria-hidden />
        <span>{localization.language.label}</span>
      </Dropdown.Trigger>
      <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => setLangOpen(false)}>{localization.language.nb}</Dropdown.Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Button onClick={() => setLangOpen(false)}>{localization.language.en}</Dropdown.Button>
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </Dropdown.TriggerContext>
  );
};

export { LanguagePicker };
