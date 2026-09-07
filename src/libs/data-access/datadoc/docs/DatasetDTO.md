
# DatasetDTO

A Dataset is a group of data files within one product and state with the same short description.

## Properties

Name | Type
------------ | -------------
`id` | string
`storage_location_name` | string
`product_short_name` | string
`short_description` | string
`assessment` | [Assessment](Assessment.md)
`dataset_state` | [DatasetState](DatasetState.md)
`owner` | string
`has_naming_standard_violations` | boolean

## Example

```typescript
import type { DatasetDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "storage_location_name": null,
  "product_short_name": null,
  "short_description": null,
  "assessment": null,
  "dataset_state": null,
  "owner": null,
  "has_naming_standard_violations": null,
} satisfies DatasetDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DatasetDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


