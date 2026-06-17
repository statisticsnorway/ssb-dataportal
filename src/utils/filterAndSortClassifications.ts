import { ClassificationResource, CodeItem, SearchResultResource } from '@/libs/data-access/klass';
import { CLASSIFICATION_TYPE_CATEGORY, ClassificationType } from '@/types/classification';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { sortAscending, sortDatesDescendingSafe, sortDescending } from '@/utils/sort';
import { SUBJECT_FIELD_BY_CODE } from '@/utils/subjectFieldsMapping';

/**
 * Maps search results to classifications based on the provided options.
 * @param classifications
 * @param searchResults
 * @param options
 * @returns
 */
export function mapSearchResultsToClassifications(
  classifications: ClassificationResource[],
  searchResults: SearchResultResource[],
  options: {
    classificationIdSelector: (item: SearchResultResource) => string | number | null | undefined;
    languageSelector?: (item: SearchResultResource) => string | null | undefined;
    language?: string;
  },
): ClassificationResource[] {
  const { classificationIdSelector, languageSelector, language = 'nb' } = options;

  const classificationsById = new Map(
    classifications.filter((c) => c.id != null).map((c) => [String(c.id), c] as const),
  );
  const getScore = (item: SearchResultResource): number => {
    const score = (item as { searchScore?: number | null }).searchScore;
    return typeof score === 'number' ? score : Number.NEGATIVE_INFINITY;
  };

  const sortedSearchResults = [...searchResults]
    .filter((item) => (languageSelector ? languageSelector(item) === language : true))
    .sort((a, b) => getScore(b) - getScore(a));

  const seen = new Set<string>();
  const mapped: ClassificationResource[] = [];

  for (const result of sortedSearchResults) {
    const rawId = classificationIdSelector(result);
    if (rawId == null) continue;

    const id = String(rawId);
    if (seen.has(id)) continue;

    const classification = classificationsById.get(id);
    if (!classification) continue;

    seen.add(id);
    mapped.push(classification);
  }

  return mapped;
}

export function mapSelectedSubjectFilters(subjectCodes: string[], subjectFields: CodeItem[]): FilterItem[] {
  return subjectCodes.map((value) => {
    const subject = subjectFields.find((item) => String(item.code) === value);
    return {
      value,
      label: subject?.name ? String(subject.name) : value,
      category: 'subject',
    };
  });
}

export function createSubjectFieldFilterItems(
  classifications: ClassificationResource[],
  subjectFields: CodeItem[],
): FilterItem[] {
  return subjectFields
    .filter((item) => !item.parentCode && item.code != null)
    .map((item) => {
      const code = String(item.code);
      const mappedFamilyIds = SUBJECT_FIELD_BY_CODE[code] ?? [];
      const count = classifications.filter((classification) => {
        if (classification.classificationFamilyId == null) return false;
        return mappedFamilyIds.includes(classification.classificationFamilyId);
      }).length;

      return {
        label: String(item.name ?? code),
        value: code,
        count,
      };
    })
    .sort((a, b) => String(a.label).localeCompare(String(b.label), 'nb'));
}

/**
 * getTypeFilterItems builds the filter items for the classification type filter.
 *
 * It maps over the known classification types (Klassifikasjon and Kodeliste)
 * and produces a FilterItem for each, including a count of how many
 * classifications in the provided list match that type.
 *
 * @param classifications - The current list of classifications to count against.
 * @returns A FilterItem array with one entry per classification type.
 */
export function createTypeFilterItems(classifications: ClassificationResource[]): FilterItem[] {
  return [ClassificationType.Klassifikasjon, ClassificationType.Kodeliste].map((value) => ({
    label: value,
    value,
    count: classifications.filter((c) => c.classificationType === value).length,
    category: CLASSIFICATION_TYPE_CATEGORY,
  }));
}

export function countClassificationsBySubjectFilters(
  classifications: ClassificationResource[],
  subjectFilters: FilterItem[],
): Record<string, number> {
  return subjectFilters.reduce<Record<string, number>>((counts, filter) => {
    const familyIds = new Set(SUBJECT_FIELD_BY_CODE[filter.value] ?? []);

    counts[filter.value] = classifications.filter((classification) => {
      if (classification.classificationFamilyId == null) return false;
      return familyIds.has(classification.classificationFamilyId);
    }).length;

    return counts;
  }, {});
}

export function filterAndSortClassifications(
  classifications: ClassificationResource[],
  subjectCodes: string[],
  sortOption: SortTypes,
  classificationTypes: string[] = [],
  keepInputOrder = false,
): ClassificationResource[] {
  const bySubject =
    subjectCodes.length === 0
      ? classifications
      : (() => {
          const familyIds = new Set(subjectCodes.flatMap((code) => SUBJECT_FIELD_BY_CODE[code] ?? []));
          return classifications.filter(
            (c) => c.classificationFamilyId != null && familyIds.has(c.classificationFamilyId),
          );
        })();

  const byType =
    classificationTypes.length === 0
      ? bySubject
      : bySubject.filter((c) => c.classificationType != null && classificationTypes.includes(c.classificationType));

  if (keepInputOrder) return byType;
  const comparators: Record<SortTypes, (a: ClassificationResource, b: ClassificationResource) => number> = {
    titleAsc: (a, b) => sortAscending(a.name, b.name),
    titleDesc: (a, b) => sortDescending(a.name, b.name),
    lastChanged: (a, b) => sortDatesDescendingSafe(a.lastModified, b.lastModified),
  };

  return [...byType].sort(comparators[sortOption]);
}
