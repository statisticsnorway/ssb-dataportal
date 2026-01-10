
# CodeChangeItem


## Properties

Name | Type
------------ | -------------
`oldCode` | string
`oldName` | string
`oldShortName` | string
`newCode` | string
`newName` | string
`newShortName` | string
`changeOccurred` | Date

## Example

```typescript
import type { CodeChangeItem } from ''

// TODO: Update the object below with actual values
const example = {
  "oldCode": null,
  "oldName": null,
  "oldShortName": null,
  "newCode": null,
  "newName": null,
  "newShortName": null,
  "changeOccurred": null,
} satisfies CodeChangeItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CodeChangeItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


