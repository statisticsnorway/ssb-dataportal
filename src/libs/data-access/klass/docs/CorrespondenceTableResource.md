
# CorrespondenceTableResource


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
`description` | string
`changelogs` | [Array&lt;ChangelogResource&gt;](ChangelogResource.md)
`correspondenceMaps` | [Array&lt;CorrespondenceMapResource&gt;](CorrespondenceMapResource.md)
`links` | [{ [key: string]: Link; }](Link.md)
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { CorrespondenceTableResource } from ''

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
  "description": null,
  "changelogs": null,
  "correspondenceMaps": null,
  "links": null,
  "embedded": null,
  "page": null,
} satisfies CorrespondenceTableResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CorrespondenceTableResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


