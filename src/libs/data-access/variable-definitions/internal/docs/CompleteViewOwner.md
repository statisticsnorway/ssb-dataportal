# CompleteViewOwner

Owner of the definition, i.e. responsible Dapla team (statistics team) and information about access management groups.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**team** | **string** | The Dapla team with responsibility for this variable definition. | [default to undefined]
**groups** | **Array&lt;string&gt;** | The groups with permission to modify this variable definition. | [default to undefined]

## Example

```typescript
import { CompleteViewOwner } from './api';

const instance: CompleteViewOwner = {
    team,
    groups,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
