
# UpdateDraft

Update variable definition Data structure with all fields optional for updating a Draft Variable Definition. Fields supplied with explicit null values will be deleted unless the field is required.

## Properties

Name | Type
------------ | -------------
`name` | [LanguageStringType](LanguageStringType.md)
`short_name` | string
`definition` | [LanguageStringType](LanguageStringType.md)
`classification_reference` | string
`unit_types` | Array&lt;string&gt;
`subject_fields` | Array&lt;string&gt;
`contains_special_categories_of_personal_data` | boolean
`variable_status` | [VariableStatus](VariableStatus.md)
`measurement_type` | string
`valid_from` | Date
`valid_until` | Date
`external_reference_uri` | string
`comment` | [LanguageStringType](LanguageStringType.md)
`related_variable_definition_uris` | Array&lt;string&gt;
`owner` | [Owner](Owner.md)
`contact` | [Contact](Contact.md)

## Example

```typescript
import type { UpdateDraft } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "short_name": null,
  "definition": null,
  "classification_reference": null,
  "unit_types": null,
  "subject_fields": null,
  "contains_special_categories_of_personal_data": null,
  "variable_status": null,
  "measurement_type": null,
  "valid_from": null,
  "valid_until": null,
  "external_reference_uri": null,
  "comment": null,
  "related_variable_definition_uris": null,
  "owner": null,
  "contact": null,
} satisfies UpdateDraft

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateDraft
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


