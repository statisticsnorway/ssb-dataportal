
# ClassificationVersionSummaryResource


## Properties

Name | Type
------------ | -------------
`name` | string
`id` | number
`validFrom` | Date
`validTo` | Date
`lastModified` | Date
`published` | Array&lt;string&gt;
`links` | [{ [key: string]: Link; }](Link.md)
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { ClassificationVersionSummaryResource } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "id": null,
  "validFrom": null,
  "validTo": null,
  "lastModified": null,
  "published": null,
  "links": null,
  "embedded": null,
  "page": null,
} satisfies ClassificationVersionSummaryResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClassificationVersionSummaryResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


