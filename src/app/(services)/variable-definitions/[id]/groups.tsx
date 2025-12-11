import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, formatDate, yesNo } from '@/utils/functions';

/**
 * ------------------------------
 * Validity Items
 * ------------------------------
 */
export const validityItems = (v: RenderedView): Item[] => [
  { label: 'Valid From', value: formatDate(v.validFrom), type: 'text' },
  { label: 'Valid Until', value: formatDate(v.validUntil ?? undefined), type: 'text' },
];

/**
 * ------------------------------
 * Audit / Created & Edited Items
 * ------------------------------
 */
export const createdAndEditedItems = (v: RenderedView): Item[] => [
  { label: 'Created At', value: formatDate(v.createdAt), type: 'text' },
  { label: 'Created By', value: v.createdBy, type: 'text' },
  { label: 'Last Updated At', value: formatDate(v.lastUpdatedAt), type: 'text' },
  { label: 'Last Updated By', value: v.lastUpdatedBy, type: 'text' },
];

/**
 * ------------------------------
 * Unit Types & Subject Fields
 * ------------------------------
 */
export const unitTypesItems = (v: RenderedView): Item[] => [
  {
    label: 'Enhetstyper',
    value: v.unitTypes
      .filter((ref) => areFieldsDefinedAndNonNull(ref, ['title']))
      .map((ref) => ref.title)
      .join(', '),
    type: 'tags',
  },
  {
    label: 'Statistikkområder',
    value: v.subjectFields
      .filter((ref) => areFieldsDefinedAndNonNull(ref, ['title']))
      .map((ref) => ref.title)
      .join(', '),
    type: 'tags',
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
    value: v.classificationUri || '-',
    type: 'link',
    display: 'Se klassifikasjon',
  },
  {
    label: 'URI til ekstern referanse',
    value: v.externalReferenceUri || '-',
    type: 'link',
    display: 'Se ekstern referanse',
  },
  {
    label: 'URI til relevante variabeldefinisjoner',
    value: Array.isArray(v.relatedVariableDefinitionUris)
      ? v.relatedVariableDefinitionUris.join(', ')
      : v.relatedVariableDefinitionUris || '-',
    type: 'link',
    display: Array.isArray(v.relatedVariableDefinitionUris)
      ? v.relatedVariableDefinitionUris.map((_, i) => `Se relevant variabeldefinisjon ${i + 1}`)
      : 'Se relevant variabeldefinisjon',
  },
];

/**
 * ------------------------------
 * Owner
 * ------------------------------
 */
export const ownerItems = (v: RenderedView): Item[] => [
  { label: 'Team', value: v.owner.team || '-', type: 'text' },
  { label: 'Groups', value: v.owner.groups.join(', '), type: 'text' },
];

/**
 * ------------------------------
 * Contact
 * ------------------------------
 */
export const contactItems = (v: RenderedView): Item[] => [
  { label: 'Title', value: v.contact?.title || '-', type: 'text' },
  { label: 'Email', value: v.contact?.email || '-', type: 'text' },
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
    type: 'text',
  },
];
