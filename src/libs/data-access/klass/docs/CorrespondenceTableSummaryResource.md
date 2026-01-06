
# CorrespondenceTableSummaryResource


## Properties

Name | Type
------------ | -------------
`name` | string
`id` | number
`contactPerson` | [ContactPersonResource](ContactPersonResource.md)
`owningSection` | string
`source` | string
`sourceId` | number
`target` | string
`targetId` | number
`changeTable` | boolean
`lastModified` | Date
`published` | Array&lt;string&gt;
`sourceLevel` | [LevelResource](LevelResource.md)
`targetLevel` | [LevelResource](LevelResource.md)
`links` | [{ [key: string]: Link; }](Link.md)
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { CorrespondenceTableSummaryResource } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "id": null,
  "contactPerson": null,
  "owningSection": null,
  "source": null,
  "sourceId": null,
  "target": null,
  "targetId": null,
  "changeTable": null,
  "lastModified": null,
  "published": null,
  "sourceLevel": null,
  "targetLevel": null,
  "links": null,
  "embedded": null,
  "page": null,
} satisfies CorrespondenceTableSummaryResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CorrespondenceTableSummaryResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


