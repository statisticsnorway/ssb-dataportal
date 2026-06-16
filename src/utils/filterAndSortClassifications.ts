import { ClassificationResource, CodeItem } from '@/libs/data-access/klass';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';
import { sortAscending, sortDatesDescendingSafe, sortDescending } from '@/utils/sort';
import { SUBJECT_FIELD_BY_CODE } from '@/utils/subjectFieldsMapping';

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

  const comparators: Record<SortTypes, (a: ClassificationResource, b: ClassificationResource) => number> = {
    titleAsc: (a, b) => sortAscending(a.name, b.name),
    titleDesc: (a, b) => sortDescending(a.name, b.name),
    lastChanged: (a, b) => sortDatesDescendingSafe(a.lastModified, b.lastModified),
  };

  return [...byType].sort(comparators[sortOption]);
}
