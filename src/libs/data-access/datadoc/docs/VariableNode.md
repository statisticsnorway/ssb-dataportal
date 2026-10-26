
# VariableNode

An API-owned representation of a node in the Parquet schema of a data file. It mirrors only the fields of Hardwood\'s \\`SchemaNode\\` that this API is interested in, rather than exposing the full Hardwood model. The \\[name\\] of a top-level node is the short name of the variable. A node with a \\[physicalType\\] is a PrimitiveNode where each row of the column holds a single data value. A node with \\[children\\] is a GroupNode where each row of the column can hold multiple data values. These may be a struct, a list or a map when its \\[logicalType\\] is \\`{\"type\": \"LIST\"}\\` or \\`{\"type\": \"MAP\"}\\`.

## Properties

Name | Type
------------ | -------------
`name` | string
`repetition_type` | [RepetitionType](RepetitionType.md)
`physical_type` | [PhysicalType](PhysicalType.md)
`logical_type` | [LogicalType](LogicalType.md)
`children` | [Array&lt;VariableNode&gt;](VariableNode.md)

## Example

```typescript
import type { VariableNode } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "repetition_type": null,
  "physical_type": null,
  "logical_type": null,
  "children": null,
} satisfies VariableNode

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VariableNode
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


