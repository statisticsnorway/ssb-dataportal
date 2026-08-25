'use client';

import { Button } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { CodeTree } from '@/components/code-tree';
import { ClassificationItemResource, ClassificationVersionResource } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import type { KlassCode } from '@/types/klass-codes';
import { filterCodesWithAncestors } from '@/utils/classifications/filterCodes';
import { mapLevels } from '../../utils/details';
import { buildDownloadHref } from '../../utils/download-urls';
import { ClassificationTable } from '../classification-table';
import { ExpandableTable } from '../expandable-table';
import { CodeSearch } from '../search';
import styles from './views.module.css';

interface CodesViewProps {
  version: Pick<ClassificationVersionResource, 'classificationItems' | 'levels' | 'id' | 'validFrom' | 'validTo'>;
  classificationId?: number;
  isVariantDownload?: boolean;
}

interface CodesToolbarProps {
  allExpanded: boolean;
  hasExpandableNodes: boolean;
  onToggleAll: () => void;
  filterTerm: string;
  onFilterTermChange: (value: string) => void;
  onFilterClear: () => void;
  showDownloadButton: boolean;
  onOpenDownloadRoute: () => void;
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

function CodesToolbar({
  allExpanded,
  hasExpandableNodes,
  onToggleAll,
  filterTerm,
  onFilterTermChange,
  onFilterClear,
  showDownloadButton,
  onOpenDownloadRoute,
}: Readonly<CodesToolbarProps>) {
  return (
    <div className={styles.codesTools}>
      <div className={styles.searchScope}>
        <CodeSearch searchId='codes-filter-input' filterTerm={filterTerm} setFilterTerm={onFilterTermChange} />
      </div>
      <div className={styles.codeTreeToolbar}>
        {hasExpandableNodes ? (
          <Button variant='secondary' onClick={onToggleAll} aria-expanded={allExpanded}>
            {allExpanded ? localization.codeTree.collapseAll : localization.codeTree.expandAll}
          </Button>
        ) : null}
        {showDownloadButton ? (
          <Button variant='secondary' onClick={onOpenDownloadRoute}>
            {localization.classification.download.button}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Shared page body rendered by both the current-codes page and the versioned-codes page.
 * The classification layout already supplies the heading, breadcrumbs and tab chrome;
 * this component is responsible for filter inputs and rendering the filtered tree.
 */
export function CodesView({ version, classificationId, isVariantDownload }: Readonly<CodesViewProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const [filterTerm, setFilterTerm] = useState('');
  const codes = version.classificationItems ?? [];
  const mappedCodes = useMemo(() => codes.map(toKlassCode), [codes]);
  const filteredCodes = useMemo(() => filterCodesWithAncestors(mappedCodes, filterTerm), [mappedCodes, filterTerm]);
  const isClassificationDownloadReady = Boolean(classificationId && version.validFrom);
  const showDownloadButton = Boolean(
    version.id && (isVariantDownload || (!isVariantDownload && isClassificationDownloadReady)),
  );

  const handleOpenDownloadRoute = () => {
    const language = localization.getLanguage() as 'nb' | 'nn' | 'en';
    router.push(buildDownloadHref(pathname, { format: 'csv', language }));
  };

  const renderToolbar = useCallback(
    ({
      allExpanded,
      hasExpandableNodes,
      toggleAll,
    }: {
      allExpanded: boolean;
      hasExpandableNodes: boolean;
      toggleAll: () => void;
    }) => (
      <CodesToolbar
        allExpanded={allExpanded}
        hasExpandableNodes={hasExpandableNodes}
        onToggleAll={toggleAll}
        filterTerm={filterTerm}
        onFilterTermChange={setFilterTerm}
        onFilterClear={() => setFilterTerm('')}
        showDownloadButton={showDownloadButton}
        onOpenDownloadRoute={handleOpenDownloadRoute}
      />
    ),
    [filterTerm, showDownloadButton, handleOpenDownloadRoute],
  );

  return (
    <div className={styles.wrapper}>
      <p>
        {localization.formatString(localization.versions.numberOfCodesAndLevels, {
          numberOfCodes: codes.length,
          numberOfLevels: version.levels?.length ?? '?',
          level: version.levels?.length === 1 ? localization.versions.level : localization.versions.levelPlural,
        })}
      </p>
      <ExpandableTable
        title={localization.classification.about.levels}
        table={
          <ClassificationTable
            content={
              version.levels?.toSorted((l1, l2) => (l1.levelNumber ?? 1) - (l2.levelNumber ?? 1)).map(mapLevels) ?? []
            }
          />
        }
      />
      <CodeTree codes={filteredCodes} toolbar={renderToolbar} autoExpandAll={filterTerm.trim().length > 0} />
    </div>
  );
}
