
# CreateDaplaDataFile

Create a Data File. A Data File is a logically defined blob of data from a file system or object storage. Its file path shall follow Dapla\'s naming conventions.

## Properties

Name | Type
------------ | -------------
`file_path` | string

## Example

```typescript
import type { CreateDaplaDataFile } from ''

// TODO: Update the object below with actual values
const example = {
  "file_path": null,
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


