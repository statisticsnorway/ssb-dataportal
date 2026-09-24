
# CompleteView

Complete view For internal users who need all details while maintaining variable definitions.

## Properties

Name | Type
------------ | -------------
`id` | string
`patch_id` | number
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
`created_at` | Date
`created_by` | string
`last_updated_at` | Date
`last_updated_by` | string

## Example

```typescript
import type { CompleteView } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "patch_id": 1,
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
  "created_at": null,
  "created_by": null,
  "last_updated_at": null,
  "last_updated_by": null,
} satisfies CompleteView

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CompleteView
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


