
# DaplaDataFileDTO

External representation of a Data File. A Data File is a logically defined blob of data from a file system or object storage. Its file path shall follow Dapla\'s naming conventions. This model is used to represent a data file to clients.

## Properties

Name | Type
------------ | -------------
`filePath` | string
`storageLocationName` | string
`fileType` | [FileType](FileType.md)
`dataLastModifiedAt` | Date
`checksum` | string
`shortDescription` | string
`productType` | [DataProductType](DataProductType.md)
`productShortName` | string
`storageCategory` | [StorageCategory](StorageCategory.md)
`assessment` | [Assessment](Assessment.md)
`datasetState` | [DatasetState](DatasetState.md)
`dataFileVersion` | number
`containsDataFrom` | Date
`containsDataUntil` | Date
`owner` | string

## Example

```typescript
import type { DaplaDataFileDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "filePath": null,
  "storageLocationName": null,
  "fileType": null,
  "dataLastModifiedAt": null,
  "checksum": null,
  "shortDescription": null,
  "productType": null,
  "productShortName": null,
  "storageCategory": null,
  "assessment": null,
  "datasetState": null,
  "dataFileVersion": null,
  "containsDataFrom": null,
  "containsDataUntil": null,
  "owner": null,
} satisfies DaplaDataFileDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DaplaDataFileDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


