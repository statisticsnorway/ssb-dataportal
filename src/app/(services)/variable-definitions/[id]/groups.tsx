import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, formatArray, formatDate, joinOrEmpty, optionalString, yesNo } from '@/utils/functions';
import { Link, Tag } from '@digdir/designsystemet-react';

export type FieldType = 'text' | 'longtext' | 'link';

/**
 * ------------------------------
 * Validity Items (plain text)
 * ------------------------------
 */
export const validityItems = (v: RenderedView): Item[] => [
  { label: 'Valid From', value: formatDate(v.validFrom) },
  { label: 'Valid Until', value: formatDate(v.validUntil ?? undefined) },
];

/**
 * ------------------------------
 * Audit / Created & Edited Items (plain text)
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
    value: v.unitTypes
      .filter((ref) => areFieldsDefinedAndNonNull(ref, ['title']))
      .map((ref, i) => <Tag key={i}>{ref.title}</Tag>),
  },
  {
    label: 'Statistikkområder',
    value: v.subjectFields
      .filter((ref) => areFieldsDefinedAndNonNull(ref, ['title']))
      .map((ref, i) => <Tag key={i}>{ref.title}</Tag>),
  },
];


// ------------------------------
// References (links)
// ------------------------------
export const referencesItems = (v: RenderedView): Item[] => [
  {
    label: 'Klassifikasjon',
    value: v.classificationUri ? (
      <Link target="_blank" href={v.classificationUri}>
        {v.classificationUri}
      </Link>
    ) : undefined,
  },
  {
    label: 'URI til ekstern referanse',
    value: v.externalReferenceUri ? (
      <Link target="_blank" href={v.externalReferenceUri}>
        {v.externalReferenceUri}
      </Link>
    ) : undefined,
  },
  {
    label: 'URI til relevante variabeldefinisjoner',
    value: v.relatedVariableDefinitionUris?.length
      ? v.relatedVariableDefinitionUris.map((uri, i) => (
          <Link key={i} target="_blank" href={uri} style={{ display: 'block' }}>
            {uri}
          </Link>
        ))
      : undefined,
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