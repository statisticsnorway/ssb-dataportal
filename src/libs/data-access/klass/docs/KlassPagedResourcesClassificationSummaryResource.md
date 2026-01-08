
# KlassPagedResourcesClassificationSummaryResource


## Properties

Name | Type
------------ | -------------
`embedded` | [KlassPagedResourcesClassificationSummaryResourceEmbedded](KlassPagedResourcesClassificationSummaryResourceEmbedded.md)
`links` | [{ [key: string]: Link; }](Link.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { KlassPagedResourcesClassificationSummaryResource } from ''

// TODO: Update the object below with actual values
const example = {
  "embedded": null,
  "links": null,
  "page": null,
} satisfies KlassPagedResourcesClassificationSummaryResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as KlassPagedResourcesClassificationSummaryResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


