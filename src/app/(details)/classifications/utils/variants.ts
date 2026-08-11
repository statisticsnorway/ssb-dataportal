import { ClassificationVariantResource } from '@/libs/data-access/klass/models/ClassificationVariantResource';
import { localization } from '@/libs/language/src/localization';
import { Item } from '@/types/item';
import { formatLocaleDate } from '@/utils/functions';
import { addRow } from './commonUtils';

/**
 * Formats the name of a classification variant by removing the "variant" suffix and trailing hyphens.
 *
 * @param name - The original name of the classification variant.
 * @returns The formatted variant name.
 */
export const formatVariantName = (name: string | undefined) => {
  if (!name) return '';
  return name.split('variant')[0]?.replace(/-\s*$/, '').trimEnd() ?? '';
};

/**
 * ------------------------------
 * Variant details
 * ------------------------------
 */

/**
 * Builds the list of variant details for a classification variant.
 *
 * Each row contains a label and a formatted value
 *
 * Missing or non-displayable values are handled by `addRow`, which inserts
 * the localized fallback text for "not relevant".
 *
 * @param variant - Classification variant source data.
 * @returns Ordered rows for rendering in the "details" section.
 */
export const mapVariantItems = (variant: ClassificationVariantResource): Item[] => {
  const rows: Item[] = [];
  addRow(rows, localization.classification.variant.id, variant.id);
  addRow(rows, localization.classification.variant.ownerSection, variant.owningSection);
  return rows;
};

export const mapVariantDetails = (variant: ClassificationVariantResource): Item[] => {
  const rows = mapVariantItems(variant);
  addRow(rows, localization.classification.variant.responsible, variant.contactPerson?.name);
  addRow(rows, localization.classification.variant.validFrom, formatLocaleDate(variant.validFrom));
  addRow(rows, localization.classification.variant.description, variant.introduction);

  return rows;
};
