import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, formatDate, yesNo } from '@/utils/functions';

/**
 * ------------------------------
 * Validity Items
 * ------------------------------
 */
export const validityItems = (v: RenderedView): Item[] => [
  { label: 'Fra', value: formatDate(v.valid_from), type: 'text' },
  { label: 'Til', value: formatDate(v.valid_until ?? undefined), type: 'text' },
];

/**
 * ------------------------------
 * Audit / Created & Edited Items
 * ------------------------------
 */
export const createdAndEditedItems = (v: RenderedView): Item[] => [
  { label: 'Sist oppdatert på', value: formatDate(v.last_updated_at), type: 'text' },
  { label: 'Sist oppdatert av', value: v.last_updated_by, type: 'text' },
  { label: 'Opprettet på', value: formatDate(v.created_at), type: 'text' },
  { label: 'Opprettet av', value: v.created_by, type: 'text' },
];

/**
 * ------------------------------
 * Unit Types & Subject Fields
 * ------------------------------
 */
export const unitTypesItems = (v: RenderedView): Item[] => [
  {
    label: 'Enhetstyper',
    value: v.unit_types.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title),
    type: 'tags',
  },
  {
    label: 'Statistikkområder',
    value: v.subject_fields.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title),
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
    value: v.classification_uri ?? null,
    type: 'link',
    display: 'Se klassifikasjon',
  },
  {
    label: 'Ekstern referanse',
    value: v.external_reference_uri ?? null,
    type: 'link',
    display: 'Se ekstern referanse',
  },
  {
    label: 'Relevante variabeldefinisjoner',
    value: Array.isArray(v.related_variable_definition_uris)
      ? v.related_variable_definition_uris.join(', ')
      : (v.related_variable_definition_uris ?? null),
    type: 'link',
    display: Array.isArray(v.related_variable_definition_uris)
      ? v.related_variable_definition_uris.map((_, i) => `Se relevant variabeldefinisjon ${i + 1}`)
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
    value: yesNo(v.contains_special_categories_of_personal_data),
    type: 'text',
  },
];
