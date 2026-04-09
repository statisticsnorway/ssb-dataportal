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
export const createdAndEditedItems = (v: RenderedView, isAuthenticated: boolean): Item[] => {
  const publicItems: Item[] = [
    { label: `${localization.editing.updated} ${localization.on}`, value: formatDate(v.last_updated_at), type: 'text' },
  ];
  const internalItems: Item[] = [
    { label: `${localization.editing.updated} ${localization.by}`, value: v.last_updated_by, type: 'text' },
    { label: `${localization.editing.created} ${localization.on}`, value: formatDate(v.created_at), type: 'text' },
    { label: `${localization.editing.created} ${localization.by}`, value: v.created_by, type: 'text' },
  ];
  return isAuthenticated ? [...publicItems, ...internalItems] : publicItems;
};

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
