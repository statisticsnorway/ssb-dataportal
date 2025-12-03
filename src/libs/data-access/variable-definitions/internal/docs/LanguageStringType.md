# LanguageStringType

Language string type Represents one text, with translations for the languages in \\[SupportedLanguages\\]. All fields are nullable to allow for flexibility for maintainers.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**nb** | **string** | Norwegian Bokmål | [optional] [default to undefined]
**nn** | **string** | Norwegian Nynorsk | [optional] [default to undefined]
**en** | **string** | English | [optional] [default to undefined]

## Example

```typescript
import { LanguageStringType } from './api';

const instance: LanguageStringType = {
    nb,
    nn,
    en,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
