import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, joinOrEmpty } from '@/utils/functions';

export type FieldType = 'text' | 'longtext' | 'link';

export const validityItems = (v: RenderedView): Item[] => [
  { label: 'Valid From', value: v.validFrom.toISOString().split('T')[0] },
  { label: 'Valid Until', value: v.validUntil?.toISOString().split('T')[0] || '-' },
];

export const createdAndEditedItems = (v: RenderedView): Item[] => [
  { label: 'Created At', value: v.createdAt.toISOString().split('T')[0] },
  { label: 'Created By', value: v.createdBy },
  { label: 'Last Updated At', value: v.lastUpdatedAt.toISOString().split('T')[0] },
  { label: 'Last Updated By', value: v.lastUpdatedBy },
];

export const unitTypesItems = (v: RenderedView): Item[] => [
  {
    label: 'Enhetstyper',
    value: joinOrEmpty(v.unitTypes.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title)),
  },
  {
    label: 'Statistikkområder',
    value: joinOrEmpty(
      v.subjectFields.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title),
    ),
  },
];

export const referencesItems = (v: RenderedView): Item[] => [
  { label: 'Klassifikasjon', value: v.classificationUri || '-', href: v.classificationUri || undefined },
  {
    label: 'URI til ekstern referanse',
    value: v.externalReferenceUri || '',
    href: v.externalReferenceUri || undefined,
  },
  {
    label: 'URI til relevante variabeldefinisjoner',
    value: joinOrEmpty(v.relatedVariableDefinitionUris),
    href: v.relatedVariableDefinitionUris?.length ? v.relatedVariableDefinitionUris.join(', ') : undefined,
  },
];

export const ownerItems = (v: RenderedView): Item[] => [
  { label: 'Team', value: v.owner.team },
  { label: 'Groups', value: v.owner.groups.join(', ') },
];


export const contactItems = (v: RenderedView): Item[] => [
  { label: 'Title', value: v.contact?.title },
  { label: 'Email', value: v.contact?.email },
];

export const personalData = (v: RenderedView): Item[] => [
  {
    label: 'Inneholder særlige kategorier av personopplysninger',
    value: v.containsSpecialCategoriesOfPersonalData ? 'Ja' : 'Nei',
  },
];
