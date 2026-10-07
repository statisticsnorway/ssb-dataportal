
# DatasetPageResponse


## Properties

Name | Type
------------ | -------------
`datasets` | [Array&lt;DatasetDTO&gt;](DatasetDTO.md)
`total_datasets` | number
`page` | number
`page_size` | number
`has_next` | boolean

## Example

```typescript
import type { DatasetPageResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "datasets": null,
  "total_datasets": null,
  "page": null,
  "page_size": null,
  "has_next": null,
} satisfies DatasetPageResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DatasetPageResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


