
# CreateDaplaDataFile

Create a Data File. A Data File is a logically defined blob of data from a file system or object storage. Its file path shall follow Dapla\'s naming conventions. \\[taskId\\] and \\[jobId\\] are optional, but must be supplied together. When supplied, the write is only accepted if \\[jobId\\] is the active job for \\[taskId\\], as set by task registration, and the file is recorded as claimed by that task in that run. Omit both to write without task tracking.

## Properties

Name | Type
------------ | -------------
`file_path` | string
`task_id` | string
`job_id` | string
`md5` | string
`size` | number
`data_last_modified_at` | Date

## Example

```typescript
import type { CreateDaplaDataFile } from ''

// TODO: Update the object below with actual values
const example = {
  "file_path": null,
  "task_id": null,
  "job_id": null,
  "md5": null,
  "size": null,
  "data_last_modified_at": null,
} satisfies CreateDaplaDataFile

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateDaplaDataFile
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


