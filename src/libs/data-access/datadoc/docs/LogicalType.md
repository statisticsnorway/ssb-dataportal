
# LogicalType

A logical type annotation, with the parameters belonging to its \\[type\\] if it has any.

## Properties

Name | Type
------------ | -------------
`type` | [LogicalTypeKind](LogicalTypeKind.md)
`precision` | number
`scale` | number
`bit_width` | number
`signed` | boolean
`adjusted_to_utc` | boolean
`unit` | [TimeUnit](TimeUnit.md)

## Example

```typescript
import type { LogicalType } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "precision": null,
  "scale": null,
  "bit_width": null,
  "signed": null,
  "adjusted_to_utc": null,
  "unit": null,
} satisfies LogicalType

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LogicalType
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


