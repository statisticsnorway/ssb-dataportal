'use client';

import { Button, Card, Dropdown, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
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

  const buildValidityPeriodHref = (validAt: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('validAt', validAt);
    return `${pathname}?${nextParams.toString()}`;
  };

  return (
    <Card>
      <Heading level={2} className='infoHeadingSecondary' data-size='md'>
        {localization.validity.validityPeriods}
      </Heading>
      <Paragraph>{localization.validity.validityPeriodsInfo}</Paragraph>
      <Button popovertarget='validity-period-dropdown'>{localization.validity.chooseValidityPeriod}</Button>
      <Dropdown id='validity-period-dropdown' style={{ minWidth: 'max-content' }} placement='bottom-start'>
        <Dropdown.List>
          {validityPeriods.map((definition) => (
            <Dropdown.Item key={formatDate(definition.valid_from)} style={{ padding: 'var(--ds-size-2)' }}>
              <Link href={buildValidityPeriodHref(formatDate(definition.valid_from))}>
                {formatLocaleDate(definition.valid_from)}
              </Link>
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown>
    </Card>
  );
}
