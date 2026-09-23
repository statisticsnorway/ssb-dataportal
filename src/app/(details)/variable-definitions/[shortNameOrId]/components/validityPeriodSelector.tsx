'use client';

import { Card, Heading, Select } from '@digdir/designsystemet-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { formatDate } from '@/utils/functions';
import styles from '../variable-details-page.module.css';

type ValidityPeriodSelectorProps = {
  variableDefinitions: RenderedView[];
  selectedValidFrom: Date;
};

export function ValidityPeriodSelector({
  variableDefinitions,
  selectedValidFrom,
}: Readonly<ValidityPeriodSelectorProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (variableDefinitions.length <= 1) {
    return null;
  }

  const selected = formatDate(selectedValidFrom);

  const handleValidityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextValidAt = event.target.value;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('validAt', nextValidAt);
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  return (
    <Card className={styles.validityCard}>
      <Heading className='infoHeadingSecondary' data-size='md' level={2}>
        {localization.validity.label}
      </Heading>
      <Select id='variable-definition-validity-select' value={selected} onChange={handleValidityChange}>
        {variableDefinitions.map((definition) => {
          const value = formatDate(definition.valid_from);
          const validTo = definition.valid_until ? formatDate(definition.valid_until) : localization.noDataPlaceholder;
          return (
            <Select.Option key={definition.id} value={value}>
              {`${value} - ${validTo}`}
            </Select.Option>
          );
        })}
      </Select>
    </Card>
  );
}
