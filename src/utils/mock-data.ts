import { VardefTabData } from './vardefTabContext';
import variableDefinitionsJson from '@/data/variable-definitions.json';

// Convert date strings to Date objects and normalize field names
const convertDates = (data: any) => {
  return data.map((item: any) => ({
    ...item,
    // Normalize snake_case to camelCase
    shortName: item.shortName || item.short_name,
    patchId: item.patchId ?? item.patch_id,
    unitTypes: item.unitTypes || item.unit_types || [],
    subjectFields: item.subjectFields || item.subject_fields || [],
    containsSpecialCategoriesOfPersonalData: item.containsSpecialCategoriesOfPersonalData ?? item.contains_special_categories_of_personal_data,
    classificationReference: item.classificationReference || item.classification_reference,
    variableStatus: item.variableStatus || item.variable_status,
    validFrom: new Date(item.validFrom || item.valid_from),
    validUntil: (item.validUntil || item.valid_until) ? new Date(item.validUntil || item.valid_until) : undefined,
    externalReferenceUri: item.externalReferenceUri || item.external_reference_uri,
    relatedVariableDefinitionUris: item.relatedVariableDefinitionUris || item.related_variable_definition_uris,
    measurementType: item.measurementType || item.measurement_type,
    createdAt: new Date(item.createdAt || item.created_at),
    createdBy: item.createdBy || item.created_by,
    lastUpdatedAt: new Date(item.lastUpdatedAt || item.last_updated_at),
    lastUpdatedBy: item.lastUpdatedBy || item.last_updated_by,
  }));
};

// Temp data for setting up prototype
export const testVardefData: VardefTabData = {
  variableDefinitions: convertDates(variableDefinitionsJson),
};
