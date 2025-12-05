import { CompleteView } from '@/libs/data-access/variable-definitions/internal/models/CompleteView';
import { Item } from '@/types/item';

export const validityItems = (v: CompleteView): Item[] => [
  { label: 'Valid From', value: v.validFrom.toISOString().split('T')[0] },
  { label: 'Valid Until', value: v.validUntil?.toISOString().split('T')[0] || '-' },
  { label: 'Created At', value: v.createdAt.toISOString().split('T')[0] },
  { label: 'Created By', value: v.createdBy },
  { label: 'Last Updated At', value: v.lastUpdatedAt.toISOString().split('T')[0] },
  { label: 'Last Updated By', value: v.lastUpdatedBy },
];

const joinOrEmpty = (arr?: string[] | null) => arr?.join(', ') || '';

export const referencesItems = (v: CompleteView): Item[] => [
  { label: 'Kodeverkets URI', value: v.classificationReference || '' },
  { label: 'Enhetstyper', value: joinOrEmpty(v.unitTypes) },
  { label: 'Statistikkområder', value: joinOrEmpty(v.subjectFields) },
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

export const ownerItems = (v: CompleteView): Item[] => [
  { label: 'Team', value: v.owner.team },
  { label: 'Groups', value: v.owner.groups.join(', ') },
  { label: 'Title', value: v.contact.title.nb },
  { label: 'Email', value: v.contact.email },
];

export const personalData = (v: CompleteView): Item[] => [
  {
    label: 'Inneholder særlige kategorier av personopplysninger',
    value: v.containsSpecialCategoriesOfPersonalData ? 'Ja' : 'Nei',
  },
];
