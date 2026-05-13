
# DatasetDTO

A Dataset is a group of data files within one product and state with the same short description.

## Properties

Name | Type
------------ | -------------
`id` | string
`storageLocationName` | string
`productShortName` | string
`shortDescription` | string
`assessment` | [Assessment](Assessment.md)
`datasetState` | [DatasetState](DatasetState.md)
`owner` | string

## Example

```typescript
import type { DatasetDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "storageLocationName": null,
  "productShortName": null,
  "shortDescription": null,
  "assessment": null,
  "datasetState": null,
  "owner": null,
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


