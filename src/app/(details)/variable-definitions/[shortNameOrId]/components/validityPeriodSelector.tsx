'use client';

import { Button, Card, Dropdown, Heading, Link } from '@digdir/designsystemet-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { formatDate, formatLocaleDate } from '@/utils/functions';

type ValidityPeriodSelectorProps = {
  validityPeriods: RenderedView[];
};

export function ValidityPeriodSelector({ validityPeriods }: Readonly<ValidityPeriodSelectorProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (validityPeriods.length <= 1) {
    return null;
  }

  const buildHref = (validAt: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('validAt', validAt);
    return `${pathname}?${nextParams.toString()}`;
  };

  const mapValidityPeriod = (definition: RenderedView) => {
    return (
      <Dropdown.Item style={{ padding: 'var(--ds-size-2)' }}>
        <Link href={buildHref(formatDate(definition.valid_from))}>{formatLocaleDate(definition.valid_from)}</Link>
      </Dropdown.Item>
    );
  };

  return (
    <Card>
      <Heading level={2} className='infoHeadingSecondary' data-size='md'>
        {localization.validity.label}
      </Heading>
      <Button popovertarget='dropdown'>Velg</Button>
      <Dropdown id='dropdown' style={{ minWidth: 'max-content' }} placement='bottom-start'>
        <Dropdown.List>{validityPeriods.map((definition) => mapValidityPeriod(definition))}</Dropdown.List>
      </Dropdown>
    </Card>
  );
}
