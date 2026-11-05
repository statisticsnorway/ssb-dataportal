
# DatasetVariablePageResponse

A page of variables belonging to a dataset.

## Properties

Name | Type
------------ | -------------
`variables` | [Array&lt;DatasetVariableDTO&gt;](DatasetVariableDTO.md)
`total_variables` | number
`page` | number
`page_size` | number
`has_next` | boolean

## Example

```typescript
import type { DatasetVariablePageResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "variables": null,
  "total_variables": null,
  "page": null,
  "page_size": null,
  "has_next": null,
} satisfies DatasetVariablePageResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DatasetVariablePageResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


