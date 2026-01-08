
# ClassificationFamilySummaryResource


## Properties

Name | Type
------------ | -------------
`name` | string
`id` | number
`numberOfClassifications` | number
`links` | [{ [key: string]: Link; }](Link.md)
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { ClassificationFamilySummaryResource } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "id": null,
  "numberOfClassifications": null,
  "links": null,
  "embedded": null,
  "page": null,
} satisfies ClassificationFamilySummaryResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClassificationFamilySummaryResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


