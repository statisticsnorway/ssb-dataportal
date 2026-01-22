import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { FilterItem } from '@/types/filters';

export const countHits = (selected: FilterItem[], raw: RenderedView[]) => {
  if (!Array.isArray(raw)) return {};
  if (!Array.isArray(selected)) return {};

  const counts: Record<string, number> = {};
  selected.forEach((def) => {
    counts[def.value] = 0;
  });

  raw.forEach((hit) => {
    if (!Array.isArray(hit.subject_fields)) return;

    selected.forEach((def) => {
      const match = hit.subject_fields.some((f) => f?.code === def.value);

      if (match) {
        counts[def.value]++;
      }
    });
  });

  return counts;
};
