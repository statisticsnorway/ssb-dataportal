'use client';

import { Search } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import { CodeTree } from '@/components/code-tree';
import { ClassificationItemResource } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import type { KlassCode } from '@/types/klass-codes';
import { filterCodesWithAncestors } from '@/utils/classifications/filterCodes';
import styles from './views.module.css';

interface CodesViewProps {
  codes: ClassificationItemResource[];
}

function toDateString(value?: string | Date | null): string | undefined {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : value;
}

function toKlassCode(item: ClassificationItemResource): KlassCode {
  return {
    code: item.code ?? '',
    parentCode: item.parentCode || null,
    level: item.level ?? '',
    name: item.name ?? '',
    shortName: item.shortName ?? undefined,
    presentationName: undefined,
    validFrom: toDateString(item.validFrom) ?? '',
    validTo: toDateString(item.validTo),
    notes: item.notes ?? '',
  };
}

/**
 * Shared page body rendered by both the current-codes page and the versioned-codes page.
 * The classification layout already supplies the heading, breadcrumbs and tab chrome;
 * this component is responsible for filter inputs and rendering the filtered tree.
 */
export function CodesView({ codes }: Readonly<CodesViewProps>) {
  const [filterTerm, setFilterTerm] = useState('');
  const mappedCodes = useMemo(() => codes.map(toKlassCode), [codes]);
  const filteredCodes = useMemo(() => filterCodesWithAncestors(mappedCodes, filterTerm), [mappedCodes, filterTerm]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchScope}>
        <Search>
          <Search.Input
            id='codes-filter-input'
            aria-label={localization.codeTree.filterLabel}
            placeholder={localization.codeTree.filterPlaceholder}
            value={filterTerm}
            onChange={(event) => setFilterTerm(event.target.value)}
          />
          <Search.Clear aria-label={localization.codeTree.clearFilter} onClick={() => setFilterTerm('')} />
          <Search.Button variant='secondary'>{localization.codeTree.filterButton}</Search.Button>
        </Search>
      </div>
      <CodeTree codes={filteredCodes} />
    </div>
  );
}
