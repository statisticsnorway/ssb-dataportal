import { CompleteResponse } from "@/libs/data-access/variable-definitions/internal/models/CompleteResponse";
import { Item } from "@/types/item";


export const validityItems = (v: CompleteResponse): Item[] => [
  { label: "Valid From", value: v.validFrom.toISOString() },
  { label: "Valid Until", value: v.validUntil?.toISOString() },
  { label: "Created At", value: v.createdAt.toISOString() },
  { label: "Created By", value: v.createdBy },
  { label: "Last Updated At", value: v.lastUpdatedAt.toISOString() },
  { label: "Last Updated By", value: v.lastUpdatedBy },
];


export const referencesItems = (v: CompleteResponse): Item[] => [
  { label: "Classification Reference", value: v.classificationReference || "" },
  { label: "Unit Types", value: v.unitTypes?.join(", ") || "" },
  { label: "Subject Fields", value: v.subjectFields?.join(", ") || "" },
  { label: "External Reference URI", value: v.externalReferenceUri || "" }, 
  { label: "Related Variable Definition URIs", value: v.relatedVariableDefinitionUris?.join(", ") || "" },
  { label: "Contains Special Categories of Personal Data", value: v.containsSpecialCategoriesOfPersonalData ? "Ja" : "Nei" },
];

export const ownerItems = (v: CompleteResponse): Item[] => [
  { label: 'Team', value: v.owner.team || '—' },
  { label: 'Groups', value: v.owner.groups.join(', ') || '—' },
  { label: 'Title', value: v.contact.title.nb ?? '—' },
  { label: 'Email', value: v.contact.email || '—' },
];

export const personalData = (v: CompleteResponse): Item[] => [
  { label: "Contains Special Categories of Personal Data", value: v.containsSpecialCategoriesOfPersonalData ? "Ja" : "Nei" },
];