'use client';

import { Search } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import { CodeTree } from '@/components/code-tree';
import { ClassificationItemResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { filterCodesWithAncestors } from '@/utils/classifications/filterCodes';
import styles from './views.module.css';

interface CodesViewProps {
  codes: ClassificationItemResource[];
}

/**
 * Shared page body rendered by both the current-codes page and the versioned-codes page.
 * The classification layout already supplies the heading, breadcrumbs and tab chrome;
 * this component is responsible for filter inputs and rendering the filtered tree.
 */
export function CodesView({ codes }: Readonly<CodesViewProps>) {
  const [filterTerm, setFilterTerm] = useState('');

  const filteredCodes = useMemo(() => filterCodesWithAncestors(codes, filterTerm), [codes, filterTerm]);

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
