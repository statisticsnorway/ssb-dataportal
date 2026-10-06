'use client';

import { Dropdown, Link } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import { localization } from '@/libs/language';
import { sortDatesDescendingSafe } from '@/utils/sort';
import { TabSlug } from '../../[id]/tabs';
import { buildUrl } from '../../utils/urls';

interface VersionPickerProps {
  classification: ClassificationWithLanguage;
  tab: TabSlug;
}

export function VersionPicker({ classification, tab }: Readonly<VersionPickerProps>) {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown.TriggerContext>
      <Dropdown.Trigger variant='secondary'>
        {open ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
        {localization.classificationDetails.versions}
      </Dropdown.Trigger>
      <Dropdown
        style={{ minWidth: 'max-content' }}
        placement='bottom-start'
        data-overscroll='contain'
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Dropdown.List>
          {(classification.versions ?? [])
            .toSorted((v1, v2) => sortDatesDescendingSafe(v1.validFrom, v2.validFrom))
            .map((v) => (
              <Dropdown.Item key={v.name} style={{ padding: 'var(--ds-size-2)' }}>
                <Link
                  href={buildUrl({ classificationId: classification.id, versionId: v.id, tab })}
                  onClick={() => setOpen(false)}
                >
                  {v.name}
                </Link>
              </Dropdown.Item>
            ))}
        </Dropdown.List>
      </Dropdown>
    </Dropdown.TriggerContext>
  );
}
