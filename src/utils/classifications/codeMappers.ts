import type { ClassificationItemResource } from '@/libs/data-access/klass/models/ClassificationItemResource';
import type { KlassCode } from '@/types/klass-codes';

/**
 * Converts a `ClassificationItemResource` (embedded in a version response) to `KlassCode`.
 * `presentationName` is not available on version items and is omitted.
 */
export function mapClassificationItemToKlassCode(item: ClassificationItemResource): KlassCode {
  return {
    code: item.code ?? '',
    parentCode: item.parentCode ?? null,
    level: item.level ?? '1',
    name: item.name ?? '',
    shortName: item.shortName,
    validFrom: item.validFrom?.toISOString().slice(0, 10) ?? '',
    validTo: item.validTo?.toISOString().slice(0, 10),
    notes: item.notes,
  };
}
