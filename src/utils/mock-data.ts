import variableDefinitionsJson from '@/data/variable-definitions.json';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { VardefTabData } from './vardefTabContext';

// Convert JSON data to CompleteResponse types since we currently use only test data
const convertToCompleteResponse = (json: any): CompleteResponse => {
  return {
    id: json.id,
    patchId: json.patch_id,
    name: json.name,
    shortName: json.short_name,
    definition: json.definition,
    classificationReference: json.classification_reference ?? undefined,
    unitTypes: json.unit_types || [],
    subjectFields: json.subject_fields || [],
    containsSpecialCategoriesOfPersonalData: json.contains_special_categories_of_personal_data,
    variableStatus: json.variable_status ?? undefined,
    measurementType: json.measurement_type ?? undefined,
    validFrom: new Date(json.valid_from),
    validUntil: json.valid_until ? new Date(json.valid_until) : undefined,
    externalReferenceUri: json.external_reference_uri ?? undefined,
    comment: json.comment ?? undefined,
    relatedVariableDefinitionUris: json.related_variable_definition_uris ?? undefined,
    owner: json.owner,
    contact: json.contact,
    createdAt: new Date(json.created_at),
    createdBy: json.created_by,
    lastUpdatedAt: new Date(json.last_updated_at),
    lastUpdatedBy: json.last_updated_by,
  };
};

// Convert JSON data to CompleteResponse types
export const testVardefData: VardefTabData = {
  variableDefinitions: variableDefinitionsJson.map(convertToCompleteResponse),
};
