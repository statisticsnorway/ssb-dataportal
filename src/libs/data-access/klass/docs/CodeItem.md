
# CodeItem


## Properties

Name | Type
------------ | -------------
`code` | string
`parentCode` | string
`level` | string
`name` | string
`shortName` | string
`presentationName` | string
`validFrom` | Date
`validTo` | Date
`notes` | string

## Example

```typescript
import type { CodeItem } from ''

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "parentCode": null,
  "level": null,
  "name": null,
  "shortName": null,
  "presentationName": null,
  "validFrom": null,
  "validTo": null,
  "notes": null,
} satisfies CodeItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CodeItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


