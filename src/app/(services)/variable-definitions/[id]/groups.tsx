import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, formatDate, yesNo } from '@/utils/functions';

/**
 * ------------------------------
 * Validity Items
 * ------------------------------
 */
export const validityItems = (v: RenderedView): Item[] => [
  { label: 'Fra', value: formatDate(v.validFrom), type: 'text' },
  { label: 'Til', value: formatDate(v.validUntil ?? undefined), type: 'text' },
];

/**
 * ------------------------------
 * Audit / Created & Edited Items
 * ------------------------------
 */
export const createdAndEditedItems = (v: RenderedView): Item[] => [
  { label: 'Sist oppdatert på', value: formatDate(v.lastUpdatedAt), type: 'text' },
  { label: 'Sist oppdatert av', value: v.lastUpdatedBy, type: 'text' },
  { label: 'Opprettet på', value: formatDate(v.createdAt), type: 'text' },
  { label: 'Opprettet av', value: v.createdBy, type: 'text' },
];

/**
 * ------------------------------
 * Unit Types & Subject Fields
 * ------------------------------
 */
export const unitTypesItems = (v: RenderedView): Item[] => [
  {
    label: 'Enhetstyper',
    value: v.unitTypes.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title),
    type: 'tags',
  },
  {
    label: 'Statistikkområder',
    value: v.subjectFields.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title),
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
    value: v.classificationUri ?? null,
    type: 'link',
    display: 'Se klassifikasjon',
  },
  {
    label: 'Ekstern referanse',
    value: v.externalReferenceUri ?? null,
    type: 'link',
    display: 'Se ekstern referanse',
  },
  {
    label: 'Relevante variabeldefinisjoner',
    value: Array.isArray(v.relatedVariableDefinitionUris)
      ? v.relatedVariableDefinitionUris.join(', ')
      : (v.relatedVariableDefinitionUris ?? null),
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
  { label: 'Dapla Team', value: v.owner.team || '-', type: 'text' },
  { label: 'Grupper', value: v.owner.groups.join(', '), type: 'text' },
];

/**
 * ------------------------------
 * Contact
 * ------------------------------
 */
export const contactItems = (v: RenderedView): Item[] => {
  if (v.contact?.email != null) {
    return [
      {
        label: 'Kontakt',
        value: `mailto:${v.contact?.email}`,
        type: 'link',
        display: v.contact?.title || 'Ta kontakt med spørsmål eller innspill',
      },
    ];
  } else {
    return [{ label: 'Kontakt', value: v.contact?.title, type: 'text' }];
  }
};

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
