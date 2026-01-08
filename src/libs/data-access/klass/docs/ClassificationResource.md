
# ClassificationResource


## Properties

Name | Type
------------ | -------------
`name` | string
`id` | number
`classificationType` | string
`lastModified` | Date
`description` | string
`primaryLanguage` | string
`copyrighted` | boolean
`includeShortName` | boolean
`includeNotes` | boolean
`contactPerson` | [ContactPersonResource](ContactPersonResource.md)
`owningSection` | string
`statisticalUnits` | Array&lt;string&gt;
`versions` | [Array&lt;ClassificationVersionSummaryResource&gt;](ClassificationVersionSummaryResource.md)
`links` | [{ [key: string]: Link; }](Link.md)
`embedded` | [ClassificationVariantSummaryResourceEmbedded](ClassificationVariantSummaryResourceEmbedded.md)
`page` | [PageMetadata](PageMetadata.md)

## Example

```typescript
import type { ClassificationResource } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "id": null,
  "classificationType": null,
  "lastModified": null,
  "description": null,
  "primaryLanguage": null,
  "copyrighted": null,
  "includeShortName": null,
  "includeNotes": null,
  "contactPerson": null,
  "owningSection": null,
  "statisticalUnits": null,
  "versions": null,
  "links": null,
  "embedded": null,
  "page": null,
} satisfies ClassificationResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClassificationResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


