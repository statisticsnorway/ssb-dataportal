
# ClassificationSummaryResource


## Properties

Name | Type
------------ | -------------
`name` | string
`id` | number
`classificationType` | string
`classificationFamilyId` | number
`lastModified` | Date
`description` | string
`links` | [{ [key: string]: Link; }](Link.md)
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { ClassificationSummaryResource } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "id": null,
  "classificationType": null,
  "classificationFamilyId": null,
  "lastModified": null,
  "description": null,
  "links": null,
  "embedded": null,
  "page": null,
} satisfies ClassificationSummaryResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClassificationSummaryResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


