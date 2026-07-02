import type { ClassificationItemResource } from '@/libs/data-access/klass/models/ClassificationItemResource';
import type { CodeItem } from '@/libs/data-access/klass/models/CodeItem';
import type { KlassCode } from '@/types/klass-codes';

/**
 * Converts a `CodeItem` from the KLASS API to the application-level `KlassCode` type.
 * All required fields fall back to safe defaults if the API omits them.
 */
export function mapCodeItemToKlassCode(item: CodeItem): KlassCode {
  return {
    code: item.code ?? '',
    parentCode: item.parentCode ?? null,
    level: item.level ?? '1',
    name: item.name ?? '',
    shortName: item.shortName,
    presentationName: item.presentationName,
    validFrom: item.validFrom?.toISOString().slice(0, 10) ?? '',
    validTo: item.validTo?.toISOString().slice(0, 10),
    notes: item.notes,
  };
}

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
