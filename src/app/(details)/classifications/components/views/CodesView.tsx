'use client';

import { Button } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CodeTree } from '@/components/code-tree';
import { CheckboxFilter } from '@/components/filters';
import {
  ClassificationItemResource,
  ClassificationVersionResource,
  LevelResource,
} from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { FilterItem } from '@/types/filters';
import type { KlassCode } from '@/types/klass-codes';
import { filterCodesWithAncestors } from '@/utils/classifications/filterCodes';
import { buildDownloadHref } from '../../utils/download-urls';
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

function getLevelValue(level: Pick<LevelResource, 'levelNumber'>, index: number): string {
  return level.levelNumber?.toString() ?? `missing-level-${index + 1}`;
}

function filterCodesBySelectedLevels(
  codes: KlassCode[],
  selectedLevels: string[],
  allLevelValues: string[],
): KlassCode[] {
  if (allLevelValues.length === 0) {
    return codes;
  }

  const selectedLevelsSet = new Set(selectedLevels);
  const selectedCodes = codes.filter((code) => selectedLevelsSet.has(code.level));
  const selectedCodeValues = new Set(selectedCodes.map((code) => code.code));
  const allCodesByCode = new Map(codes.map((code) => [code.code, code]));

  return selectedCodes.map((code) => {
    let parentCode = code.parentCode;

    while (parentCode && !selectedCodeValues.has(parentCode)) {
      parentCode = allCodesByCode.get(parentCode)?.parentCode ?? null;
    }

    return {
      ...code,
      parentCode,
    };
  });
}

function CodesToolbar({
  allExpanded,
  hasExpandableNodes,
  onToggleAll,
  filterTerm,
  onFilterTermChange,
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
  const sortedLevels = useMemo(
    () => version.levels?.toSorted((l1, l2) => (l1.levelNumber ?? 1) - (l2.levelNumber ?? 1)) ?? [],
    [version.levels],
  );
  const allLevelValues = useMemo(() => sortedLevels.map((level, index) => getLevelValue(level, index)), [sortedLevels]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(allLevelValues);

  useEffect(() => {
    setSelectedLevels(allLevelValues);
  }, [allLevelValues]);

  const mappedCodes = useMemo(() => codes.map(toKlassCode), [codes]);
  const levelFilteredCodes = useMemo(
    () => filterCodesBySelectedLevels(mappedCodes, selectedLevels, allLevelValues),
    [allLevelValues, mappedCodes, selectedLevels],
  );
  const filteredCodes = useMemo(
    () => filterCodesWithAncestors(levelFilteredCodes, filterTerm),
    [levelFilteredCodes, filterTerm],
  );
  const isClassificationDownloadReady = Boolean(classificationId && version.validFrom);
  const showDownloadButton = Boolean(
    version.id && (isVariantDownload || (!isVariantDownload && isClassificationDownloadReady)),
  );

  const handleOpenDownloadRoute = () => {
    const language = localization.getLanguage() as 'nb' | 'nn' | 'en';
    const level = selectedLevels.length === 1 && allLevelValues.length > 1 ? selectedLevels[0] : undefined;
    router.push(buildDownloadHref(pathname, { format: 'csv', language, level }));
  };

  const handleLevelToggle = (levelValue: string) => {
    setSelectedLevels((currentSelectedLevels) =>
      currentSelectedLevels.includes(levelValue)
        ? currentSelectedLevels.filter((currentLevelValue) => currentLevelValue !== levelValue)
        : [...currentSelectedLevels, levelValue],
    );
  };

  const levelFilters = useMemo<FilterItem[]>(
    () =>
      sortedLevels.map((level, index) => ({
        label: level.levelName,
        value: getLevelValue(level, index),
      })),
    [sortedLevels],
  );

  const selectedLevelFilters = useMemo<FilterItem[]>(
    () => levelFilters.filter((filter) => selectedLevels.includes(filter.value)),
    [levelFilters, selectedLevels],
  );

  const handleLevelFilterChange = useCallback(
    (filter: FilterItem) => {
      handleLevelToggle(filter.value);
    },
    [handleLevelToggle],
  );

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
        {localization.formatString(
          isVariantDownload
            ? localization.classification.variant.numberOfCodesAndLevels
            : localization.versions.numberOfCodesAndLevels,
          {
            numberOfCodes: codes.length,
            numberOfLevels: version.levels?.length ?? '?',
            level: version.levels?.length === 1 ? localization.versions.level : localization.versions.levelPlural,
          },
        )}
      </p>
      {sortedLevels.length > 1 ? (
        <CheckboxFilter
          filterHeading={localization.classification.filterLevels}
          filters={levelFilters}
          selectedItems={selectedLevelFilters}
          onFilterChange={handleLevelFilterChange}
        />
      ) : null}
      <CodeTree codes={filteredCodes} toolbar={renderToolbar} autoExpandAll={filterTerm.trim().length > 0} />
    </div>
  );
}
