
# SsbSectionResource


## Properties

Name | Type
------------ | -------------
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`links` | [{ [key: string]: Link; }](Link.md)
`name` | string
`page` | [PageMetadata](PageMetadata.md)
`id` | number

## Example

```typescript
import type { SsbSectionResource } from ''

// TODO: Update the object below with actual values
const example = {
  "embedded": null,
  "links": null,
  "name": null,
  "page": null,
  "id": null,
} satisfies SsbSectionResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SsbSectionResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


