
# DaplaDataFilePageResponse


## Properties

Name | Type
------------ | -------------
`data_files` | [Array&lt;DaplaDataFileDTO&gt;](DaplaDataFileDTO.md)
`total_data_files` | number
`page` | number
`page_size` | number
`has_next` | boolean

## Example

```typescript
import type { DaplaDataFilePageResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "data_files": null,
  "total_data_files": null,
  "page": null,
  "page_size": null,
  "has_next": null,
} satisfies DaplaDataFilePageResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DaplaDataFilePageResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


