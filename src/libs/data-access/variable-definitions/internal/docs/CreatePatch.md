
# CreatePatch

Create a new Patch version on a Published Variable Definition.

## Properties

Name | Type
------------ | -------------
`name` | [LanguageStringType](LanguageStringType.md)
`definition` | [LanguageStringType](LanguageStringType.md)
`classification_reference` | string
`unit_types` | Array&lt;string&gt;
`subject_fields` | Array&lt;string&gt;
`contains_special_categories_of_personal_data` | boolean
`variable_status` | [VariableStatus](VariableStatus.md)
`measurement_type` | string
`valid_until` | Date
`external_reference_uri` | string
`comment` | [LanguageStringType](LanguageStringType.md)
`related_variable_definition_uris` | Array&lt;string&gt;
`owner` | [Owner](Owner.md)
`contact` | [Contact](Contact.md)

## Example

```typescript
import type { CreatePatch } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "definition": null,
  "classification_reference": null,
  "unit_types": null,
  "subject_fields": null,
  "contains_special_categories_of_personal_data": null,
  "variable_status": null,
  "measurement_type": null,
  "valid_until": null,
  "external_reference_uri": null,
  "comment": null,
  "related_variable_definition_uris": null,
  "owner": null,
  "contact": null,
} satisfies CreatePatch

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePatch
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


