import { CompleteResponse } from "@/libs/data-access/variable-definitions/internal/models/CompleteResponse";
import { Item } from "@/types/item";


export const validityItems = (v: CompleteResponse): Item[] => [
  { label: "Valid From", value: v.validFrom.toISOString().split("T")[0] },
  { label: "Valid Until", value: v.validUntil?.toISOString().split("T")[0] },
  { label: "Created At", value: v.createdAt.toISOString().split("T")[0] },
  { label: "Created By", value: v.createdBy },
  { label: "Last Updated At", value: v.lastUpdatedAt.toISOString().split("T")[0] },
  { label: "Last Updated By", value: v.lastUpdatedBy },
];


export const referencesItems = (v: CompleteResponse): Item[] => [
  { label: "Kodeverkets URI", value: v.classificationReference || "" },
  { label: "Enhetstyper", value: v.unitTypes?.join(", ") || "" },
  { label: "Statistikkområder", value: v.subjectFields?.join(", ") || "" },
  { label: "URI til ekstern referanse", value: v.externalReferenceUri || "", href: v.externalReferenceUri ? v.externalReferenceUri : undefined }, 
  { label: "URI til relevante variabeldefinisjoner", value: v.relatedVariableDefinitionUris?.join(", ") || "", href: v.relatedVariableDefinitionUris?.join(", ") ? v.relatedVariableDefinitionUris?.join(", ") : undefined },
];

export const ownerItems = (v: CompleteResponse): Item[] => [
  { label: 'Team', value: v.owner.team || '—' },
  { label: 'Groups', value: v.owner.groups.join(', ') || '—' },
  { label: 'Title', value: v.contact.title.nb ?? '—' },
  { label: 'Email', value: v.contact.email || '—' },
];

export const personalData = (v: CompleteResponse): Item[] => [
  { label: "Inneholder særlige kategorier av personopplysninger", value: v.containsSpecialCategoriesOfPersonalData ? "Ja" : "Nei" },
];