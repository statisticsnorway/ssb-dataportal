
# NamingViolationResponse


## Properties

Name | Type
------------ | -------------
`reported_at` | string
`number_of_violations` | number
`violations` | [Array&lt;NamingViolation&gt;](NamingViolation.md)

## Example

```typescript
import type { NamingViolationResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "reported_at": null,
  "number_of_violations": null,
  "violations": null,
} satisfies NamingViolationResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NamingViolationResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


