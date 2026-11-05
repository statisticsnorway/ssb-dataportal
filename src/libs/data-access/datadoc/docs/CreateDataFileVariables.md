
# CreateDataFileVariables

Variables received for an existing data file: the top-level nodes of its Parquet schema.

## Properties

Name | Type
------------ | -------------
`variables` | [Array&lt;VariableNode&gt;](VariableNode.md)

## Example

```typescript
import type { CreateDataFileVariables } from ''

// TODO: Update the object below with actual values
const example = {
  "variables": null,
} satisfies CreateDataFileVariables

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateDataFileVariables
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


