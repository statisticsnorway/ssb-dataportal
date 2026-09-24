
# ListVariableDefinitions200ResponseInner


## Properties

Name | Type
------------ | -------------
`id` | string
`patch_id` | number
`name` | string
`short_name` | string
`definition` | string
`classification_reference` | string
`unit_types` | [Array&lt;KlassReference&gt;](KlassReference.md)
`subject_fields` | [Array&lt;KlassReference&gt;](KlassReference.md)
`contains_special_categories_of_personal_data` | boolean
`variable_status` | [VariableStatus](VariableStatus.md)
`measurement_type` | [KlassReference](KlassReference.md)
`valid_from` | Date
`valid_until` | Date
`external_reference_uri` | string
`comment` | string
`related_variable_definition_uris` | Array&lt;string&gt;
`owner` | [Owner](Owner.md)
`contact` | [RenderedContact](RenderedContact.md)
`created_at` | Date
`created_by` | string
`last_updated_at` | Date
`last_updated_by` | string
`classification_uri` | string

## Example

```typescript
import type { ListVariableDefinitions200ResponseInner } from ''

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
  "classification_uri": null,
} satisfies ListVariableDefinitions200ResponseInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListVariableDefinitions200ResponseInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


