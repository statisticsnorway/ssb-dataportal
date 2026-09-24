
# LanguageStringType

Language string type Represents one text, with translations for the languages in \\[SupportedLanguages\\]. All fields are nullable to allow for flexibility for maintainers.

## Properties

Name | Type
------------ | -------------
`nb` | string
`nn` | string
`en` | string

## Example

```typescript
import type { LanguageStringType } from ''

// TODO: Update the object below with actual values
const example = {
  "nb": null,
  "nn": null,
  "en": null,
} satisfies LanguageStringType

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LanguageStringType
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


