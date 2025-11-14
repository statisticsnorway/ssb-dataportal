export type ReferenceItem = {
  reference_uri: string;
  code: string;
  title: string;
};

export type ContactType = {
  title: string;
  email: string;
};

export type VariableDefinitionType = {
  id: string;
  patch_id?: string;
  name: string;
  short_name: string;
  definition: string;
  last_updated_at: string;
  valid_from: string;
  valid_until?: string;
  comment?: string;
  contains_special_categories_of_personal_data: boolean;
  subject_fields?: ReferenceItem[];
  unit_types?: ReferenceItem[];
  classification_uri?: string;
  measurement_type?: string;
  external_reference_uri?: URL;
  related_variable_definition_uris?: URL[];
  contact: ContactType;
};
