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
  const familyIds = new Set(subjectCodes.flatMap((subjectCode) => SUBJECT_FIELD_BY_CODE[subjectCode] ?? []));

  let filtered =
    subjectCodes.length === 0
      ? classifications
      : classifications.filter((classification) => {
          if (classification.classificationFamilyId == null) return false;
          return familyIds.has(classification.classificationFamilyId);
        });

  if (classificationTypes.length > 0) {
    filtered = filtered.filter(
      (classification) =>
        classification.classificationType != null && classificationTypes.includes(classification.classificationType),
    );
  }

  return [...filtered].sort((a, b) => {
    if (sortOption === 'titleAsc') {
      return sortAscending(a.name, b.name);
    }

    if (sortOption === 'titleDesc') {
      return sortDescending(a.name, b.name);
    }

    return sortDatesDescendingSafe(a.lastModified, b.lastModified);
  });
}
