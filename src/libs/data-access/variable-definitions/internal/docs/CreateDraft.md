# CreateDraft

Create a Draft Variable Definition

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | [**CompleteViewName**](CompleteViewName.md) |  | [default to undefined]
**short_name** | **string** | Recommended short name. Must be unique within an organization. | [default to undefined]
**definition** | [**CompleteViewDefinition**](CompleteViewDefinition.md) |  | [default to undefined]
**classification_reference** | **string** | ID of a classification or code list from Klass. The given classification defines all possible values for the defined variable. | [optional] [default to undefined]
**unit_types** | **Array&lt;string&gt;** | A list of one or more unit types, e.g. person, vehicle, household. Must be defined as codes from https://www.ssb.no/klass/klassifikasjoner/702. | [default to undefined]
**subject_fields** | **Array&lt;string&gt;** | A list of subject fields that the variable is used in. Must be defined as codes from https://www.ssb.no/klass/klassifikasjoner/618. | [default to undefined]
**contains_special_categories_of_personal_data** | **boolean** | True if variable instances contain particularly sensitive information. Applies even if the information or identifiers are pseudonymized. Information within the following categories are regarded as particularly sensitive: Ethnicity, Political alignment, Religion, Philosophical beliefs, Union membership, Genetics, Biometrics, Health, Sexual relations, Sexual orientation | [default to false]
**measurement_type** | **string** | Type of measurement for the variable, e.g. length, volume, currency. Must be defined as codes from https://www.ssb.no/klass/klassifikasjoner/303 | [optional] [default to undefined]
**valid_from** | **string** | The variable definition is valid from this date inclusive | [default to undefined]
**valid_until** | **string** | The variable definition is valid until this date inclusive | [optional] [default to undefined]
**external_reference_uri** | **string** | A link (URI) to an external definition/documentation | [optional] [default to undefined]
**comment** | [**CompleteViewComment**](CompleteViewComment.md) |  | [optional] [default to undefined]
**related_variable_definition_uris** | **Array&lt;string&gt;** | Link(s) to related definitions of variables - a list of one or more definitions. For example for a variable after-tax income it could be relevant to link to definitions of income from work, property income etc. | [optional] [default to undefined]
**contact** | [**CompleteViewContact**](CompleteViewContact.md) |  | [default to undefined]

## Example

```typescript
import { CreateDraft } from './api';

const instance: CreateDraft = {
    name,
    short_name,
    definition,
    classification_reference,
    unit_types,
    subject_fields,
    contains_special_categories_of_personal_data,
    measurement_type,
    valid_from,
    valid_until,
    external_reference_uri,
    comment,
    related_variable_definition_uris,
    contact,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
