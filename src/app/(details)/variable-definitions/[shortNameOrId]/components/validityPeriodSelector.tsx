'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { DetailsTable } from '@/components/details-table';
import { ExpandableDetails } from '@/components/expandable-details';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { VersionItem } from '@/types/item';
import { formatDate } from '@/utils/functions';

type ValidityPeriodSelectorProps = {
  variableDefinitions: RenderedView[];
};

export function ValidityPeriodSelector({ variableDefinitions }: Readonly<ValidityPeriodSelectorProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (variableDefinitions.length <= 1) {
    return null;
  }

  const buildHref = (validAt: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('validAt', validAt);
    return `${pathname}?${nextParams.toString()}`;
  };

  const mapValidityPeriod = (definition: RenderedView): VersionItem[] => {
    const validFrom = formatDate(definition.valid_from);
    const validTo = definition.valid_until ? formatDate(definition.valid_until) : localization.noDataPlaceholder;

    return [
      {
        label: localization.validity.validFrom,
        value: (
          <Link
            href={buildHref(validFrom)}
            scroll={false}
            onClick={(event) => {
              const details = event.currentTarget.closest('details');
              details?.removeAttribute('open');
            }}
          >
            {validFrom}
          </Link>
        ),
      },
      {
        label: localization.validity.validTo,
        value: validTo,
      },
    ];
  };

  return (
    <ExpandableDetails
      title={localization.validity.label}
      table={
        <DetailsTable
          sortableField={localization.validity.validFrom}
          content={variableDefinitions.map((definition) => mapValidityPeriod(definition))}
        />
      }
    />
  );
}
