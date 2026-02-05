import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, formatDate, yesNo } from '@/utils/functions';

/**
 * ------------------------------
 * Validity Items
 * ------------------------------
 */
export const validityItems = (v: RenderedView): Item[] => [
  { label: localization.from, value: formatDate(v.valid_from), type: 'text' },
  { label: localization.to, value: formatDate(v.valid_until ?? undefined), type: 'text' },
];

/**
 * ------------------------------
 * Audit / Created & Edited Items
 * ------------------------------
 */
export const createdAndEditedItems = (v: RenderedView): Item[] => [
  { label: `${localization.editing.updated} ${localization.on}`, value: formatDate(v.last_updated_at), type: 'text' },
  { label: `${localization.editing.updated} ${localization.by}`, value: v.last_updated_by, type: 'text' },
  { label: `${localization.editing.created} ${localization.on}`, value: formatDate(v.created_at), type: 'text' },
  { label: `${localization.editing.created} ${localization.by}`, value: v.created_by, type: 'text' },
];

/**
 * ------------------------------
 * Unit Types & Subject Fields
 * ------------------------------
 */
export const unitTypesItems = (v: RenderedView): Item[] => [
  {
    label: localization.unitTypes,
    value: v.unit_types.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title),
    type: 'tags',
  },
  {
    label: localization.subjectFields,
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
    label: localization.classification.label,
    value: v.classification_uri ?? null,
    type: 'link',
    display: localization.classification.view,
  },
  {
    label: localization.variableDefinition.externalReference,
    value: v.external_reference_uri ?? null,
    type: 'link',
    display: localization.variableDefinition.viewExternalReference,
  },
  {
    label: localization.variableDefinition.relevant,
    value: Array.isArray(v.related_variable_definition_uris)
      ? v.related_variable_definition_uris.join(', ')
      : (v.related_variable_definition_uris ?? null),
    type: 'link',
    display: Array.isArray(v.related_variable_definition_uris)
      ? v.related_variable_definition_uris.map((_, i) => `${localization.variableDefinition.viewRelevant} ${i + 1}`)
      : localization.variableDefinition.viewRelevant,
  },
];

/**
 * ------------------------------
 * Owner
 * ------------------------------
 */
export const ownerItems = (v: RenderedView): Item[] => [
  { label: localization.owner.daplaTeam, value: v.owner.team || '-', type: 'text' },
  { label: localization.owner.groups, value: v.owner.groups.join(', '), type: 'text' },
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
        label: localization.contact.label,
        //TODO(cbi): Check valid pattern for link to email [https://github.com/statisticsnorway/metadata-catalog-prototype/issues/115]
        value: `mailto:${v.contact?.email}`,
        type: 'link',
        display: v.contact?.title || localization.contact.fallbackTitle,
      },
    ];
  } else {
    return [{ label: localization.contact.label, value: v.contact?.title, type: 'text' }];
  }
};

/**
 * ------------------------------
 * Personal Data
 * ------------------------------
 */
export const personalDataItems = (v: RenderedView): Item[] => [
  {
    label: localization.variableDefinition.personalData,
    value: yesNo(v.contains_special_categories_of_personal_data),
    type: 'text',
  },
];
