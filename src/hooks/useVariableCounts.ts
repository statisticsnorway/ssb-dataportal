import { use, useMemo } from 'react';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { convertStatus, getParentCode } from '@/utils/functions';

export const STATUSES: FilterItem[] = [
  { value: VariableStatus.Draft, label: convertStatus(VariableStatus.Draft) },
  { value: VariableStatus.PublishedInternal, label: convertStatus(VariableStatus.PublishedInternal) },
  { value: VariableStatus.PublishedExternal, label: convertStatus(VariableStatus.PublishedExternal) },
];

/**
 * Computes the count of variables per status.
 *
 * This hook resolves the full list of variables from a promise
 * and returns how many variables exist for each status defined
 * in `allStatusFilters`. The counts are memoized with `useMemo`.
 *
 */
export function useStatusCounts(
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>,
): FilterItem[] {
  const { data: variables } = use(variablesPromise);

  const counts: FilterItem[] = useMemo(() => {
    const statusCounts: Record<string, number> = {};

    if (!variables?.length) return STATUSES;

    STATUSES.forEach((f) => (statusCounts[f.value] = 0));

    variables.forEach((variable: RenderedView) => {
      const status = String(variable.variable_status);
      if (Object.hasOwn(statusCounts, status)) {
        if (statusCounts[status] == undefined) {
          statusCounts[status] = 0;
        }
        statusCounts[status] += 1;
      }
    });

    return STATUSES.map((status) => ({
      ...status,
      count: statusCounts[status.value] ?? 0,
    }));
  }, [variables, STATUSES]);

  return counts;
}

interface UseSubjectFieldCountsProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  allSubjectFilters: FilterItem[];
}

interface SubjectFieldCounts {
  subjectCounts: Record<string, number>;
}

/**
 * Computes the count of variables per subject field.
 *
 * Resolves the full list of variables from a promise and counts
 * how many variables have each subject field in `allSubjectFilters`.
 * Each variable can have multiple subject fields, all are counted.
 * Counts are memoized with `useMemo`.
 *
 */
export function useSubjectFieldCounts({ variablesPromise, allSubjectFilters }: UseSubjectFieldCountsProps) {
  const { data: variables, error } = use(variablesPromise);

  const counts: SubjectFieldCounts = useMemo(() => {
    const subjectCounts: Record<string, number> = {};

    if (!variables?.length) return { subjectCounts };

    allSubjectFilters.forEach((f) => (subjectCounts[f.value] = 0));

    variables.forEach((variable) => {
      variable.subject_fields?.forEach((sf) => {
        const code = getParentCode(String(sf.code));
        if (Object.hasOwn(subjectCounts, code)) {
          if (subjectCounts[code] == undefined) {
            subjectCounts[code] = 0;
          }
          subjectCounts[code] += 1;
        }
      });
    });

    return { subjectCounts };
  }, [variables, allSubjectFilters]);

  return { counts, error, variables };
}
