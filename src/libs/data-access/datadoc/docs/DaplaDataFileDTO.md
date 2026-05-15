
# DaplaDataFileDTO

External representation of a Data File. A Data File is a logically defined blob of data from a file system or object storage. Its file path shall follow Dapla\'s naming conventions. This model is used to represent a data file to clients.

## Properties

Name | Type
------------ | -------------
`file_path` | string
`storage_location_name` | string
`file_type` | [FileType](FileType.md)
`data_last_modified_at` | Date
`checksum` | string
`short_description` | string
`product_type` | [DataProductType](DataProductType.md)
`product_short_name` | string
`storage_category` | [StorageCategory](StorageCategory.md)
`assessment` | [Assessment](Assessment.md)
`dataset_state` | [DatasetState](DatasetState.md)
`data_file_version` | number
`contains_data_from` | Date
`contains_data_until` | Date
`owner` | string

## Example

```typescript
import type { DaplaDataFileDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "file_path": null,
  "storage_location_name": null,
  "file_type": null,
  "data_last_modified_at": null,
  "checksum": null,
  "short_description": null,
  "product_type": null,
  "product_short_name": null,
  "storage_category": null,
  "assessment": null,
  "dataset_state": null,
  "data_file_version": null,
  "contains_data_from": null,
  "contains_data_until": null,
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


