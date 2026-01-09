
# ClassificationVersionResource


## Properties

Name | Type
------------ | -------------
`name` | string
`id` | number
`validFrom` | Date
`validTo` | Date
`lastModified` | Date
`published` | Array&lt;string&gt;
`introduction` | string
`contactPerson` | [ContactPersonResource](ContactPersonResource.md)
`owningSection` | string
`legalBase` | string
`publications` | string
`derivedFrom` | string
`correspondenceTables` | [Array&lt;CorrespondenceTableSummaryResource&gt;](CorrespondenceTableSummaryResource.md)
`classificationVariants` | [Array&lt;ClassificationVariantSummaryResource&gt;](ClassificationVariantSummaryResource.md)
`changelogs` | [Array&lt;ChangelogResource&gt;](ChangelogResource.md)
`levels` | [Array&lt;LevelResource&gt;](LevelResource.md)
`classificationItems` | [Array&lt;ClassificationItemResource&gt;](ClassificationItemResource.md)
`links` | [{ [key: string]: Link; }](Link.md)
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { ClassificationVersionResource } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "id": null,
  "validFrom": null,
  "validTo": null,
  "lastModified": null,
  "published": null,
  "introduction": null,
  "contactPerson": null,
  "owningSection": null,
  "legalBase": null,
  "publications": null,
  "derivedFrom": null,
  "correspondenceTables": null,
  "classificationVariants": null,
  "changelogs": null,
  "levels": null,
  "classificationItems": null,
  "links": null,
  "embedded": null,
  "page": null,
} satisfies ClassificationVersionResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClassificationVersionResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


