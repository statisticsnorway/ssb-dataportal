
# DataProductDTO

Data Product

## Properties

Name | Type
------------ | -------------
`product_type` | [DataProductType](DataProductType.md)
`product_short_name` | string
`title` | string
`subject_code` | string
`has_naming_standard_violations` | boolean

## Example

```typescript
import type { DataProductDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "product_type": null,
  "product_short_name": null,
  "title": null,
  "subject_code": null,
  "has_naming_standard_violations": null,
} satisfies DataProductDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DataProductDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


