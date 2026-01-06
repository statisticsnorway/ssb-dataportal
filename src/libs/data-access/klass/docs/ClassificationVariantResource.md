
# ClassificationVariantResource


## Properties

Name | Type
------------ | -------------
`name` | string
`id` | number
`contactPerson` | [ContactPersonResource](ContactPersonResource.md)
`owningSection` | string
`lastModified` | Date
`published` | Array&lt;string&gt;
`validFrom` | Date
`validTo` | Date
`introduction` | string
`correspondenceTables` | [Array&lt;CorrespondenceTableSummaryResource&gt;](CorrespondenceTableSummaryResource.md)
`changelogs` | [Array&lt;ChangelogResource&gt;](ChangelogResource.md)
`levels` | [Array&lt;LevelResource&gt;](LevelResource.md)
`classificationItems` | [Array&lt;ClassificationItemResource&gt;](ClassificationItemResource.md)
`links` | [{ [key: string]: Link; }](Link.md)
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { ClassificationVariantResource } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "id": null,
  "contactPerson": null,
  "owningSection": null,
  "lastModified": null,
  "published": null,
  "validFrom": null,
  "validTo": null,
  "introduction": null,
  "correspondenceTables": null,
  "changelogs": null,
  "levels": null,
  "classificationItems": null,
  "links": null,
  "embedded": null,
  "page": null,
} satisfies ClassificationVariantResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClassificationVariantResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


