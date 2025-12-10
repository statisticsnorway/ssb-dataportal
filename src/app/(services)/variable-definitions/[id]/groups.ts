import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, formatArray, formatDate, joinOrEmpty, optionalString, yesNo } from '@/utils/functions';

export type FieldType = 'text' | 'longtext' | 'link';

/**
 * ------------------------------
 * Validity Items
 * ------------------------------
 */
export const validityItems = (v: RenderedView): Item[] => [
  { label: 'Valid From', value: formatDate(v.validFrom) },
  { label: 'Valid Until', value: formatDate(v.validUntil ?? undefined) },
];

/**
 * ------------------------------
 * Audit / Created & Edited Items
 * ------------------------------
 */
export const createdAndEditedItems = (v: RenderedView): Item[] => [
  { label: 'Created At', value: formatDate(v.createdAt) },
  { label: 'Created By', value: v.createdBy },
  { label: 'Last Updated At', value: formatDate(v.lastUpdatedAt) },
  { label: 'Last Updated By', value: v.lastUpdatedBy },
];

/**
 * ------------------------------
 * Unit Types & Subject Fields
 * ------------------------------
 */
export const unitTypesItems = (v: RenderedView): Item[] => [
  {
    label: 'Enhetstyper',
    value: formatArray(
      v.unitTypes.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title),
    ),
  },
  {
    label: 'Statistikkområder',
    value: formatArray(
      v.subjectFields.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title),
    ),
  },
];

/**
 * ------------------------------
 * References
 * ------------------------------
 */
export const referencesItems = (v: RenderedView): Item[] => [
  { 
    label: 'Klassifikasjon', 
    value: optionalString(v.classificationUri ?? undefined), 
    href: v.classificationUri || undefined 
  },
  { 
    label: 'URI til ekstern referanse', 
    value: optionalString(v.externalReferenceUri ?? undefined), 
    href: v.externalReferenceUri || undefined 
  },
  { 
    label: 'URI til relevante variabeldefinisjoner', 
    value: formatArray(v.relatedVariableDefinitionUris ?? undefined),
    href: v.relatedVariableDefinitionUris?.length ? v.relatedVariableDefinitionUris.join(', ') : undefined,
  },
];

/**
 * ------------------------------
 * Owner
 * ------------------------------
 */
export const ownerItems = (v: RenderedView): Item[] => [
  { label: 'Team', value: v.owner.team },
  { label: 'Groups', value: v.owner.groups.join(', ') },
];

/**
 * ------------------------------
 * Contact
 * ------------------------------
 */
export const contactItems = (v: RenderedView): Item[] => [
  { label: 'Title', value: v.contact?.title },
  { label: 'Email', value: v.contact?.email },
];

/**
 * ------------------------------
 * Personal Data
 * ------------------------------
 */
export const personalDataItems = (v: RenderedView): Item[] => [
  {
    label: 'Inneholder særlige kategorier av personopplysninger',
    value: yesNo(v.containsSpecialCategoriesOfPersonalData),
  },
];