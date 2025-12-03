# DraftVariableDefinitionsApi

All URIs are relative to *https://metadata.intern.ssb.no*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createVariableDefinition**](#createvariabledefinition) | **POST** /variable-definitions | Create a variable definition.|
|[**deleteVariableDefinitionById**](#deletevariabledefinitionbyid) | **DELETE** /variable-definitions/{variable-definition-id} | Delete a variable definition.|
|[**updateVariableDefinitionById**](#updatevariabledefinitionbyid) | **PATCH** /variable-definitions/{variable-definition-id} | Update a variable definition.|

# **createVariableDefinition**
> CompleteView createVariableDefinition()

Create a variable definition. New variable definitions are automatically assigned status DRAFT and must include all required fields. Attempts to specify id or variable_status in a request will receive 400 BAD REQUEST responses.

### Example

```typescript
import {
    DraftVariableDefinitionsApi,
    Configuration,
    CreateDraft
} from './api';

const configuration = new Configuration();
const apiInstance = new DraftVariableDefinitionsApi(configuration);

let createDraft: CreateDraft; // (optional)

const { status, data } = await apiInstance.createVariableDefinition(
    createDraft
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createDraft** | **CreateDraft**|  | |


### Return type

**CompleteView**

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successfully created. |  -  |
|**400** | Bad request. |  -  |
|**409** | Short name is already in use by another variable definition. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteVariableDefinitionById**
> deleteVariableDefinitionById()

Delete a variable definition.

### Example

```typescript
import {
    DraftVariableDefinitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DraftVariableDefinitionsApi(configuration);

let variableDefinitionId: string; //Unique identifier for the variable definition. (default to undefined)

const { status, data } = await apiInstance.deleteVariableDefinitionById(
    variableDefinitionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variableDefinitionId** | [**string**] | Unique identifier for the variable definition. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successfully deleted |  -  |
|**404** | Not found |  -  |
|**405** | Not allowed for variable definitions with this status. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateVariableDefinitionById**
> CompleteView updateVariableDefinitionById()

Update a variable definition. Only the fields which need updating should be supplied.

### Example

```typescript
import {
    DraftVariableDefinitionsApi,
    Configuration,
    UpdateDraft
} from './api';

const configuration = new Configuration();
const apiInstance = new DraftVariableDefinitionsApi(configuration);

let variableDefinitionId: string; //Unique identifier for the variable definition. (default to undefined)
let updateDraft: UpdateDraft; // (optional)

const { status, data } = await apiInstance.updateVariableDefinitionById(
    variableDefinitionId,
    updateDraft
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateDraft** | **UpdateDraft**|  | |
| **variableDefinitionId** | [**string**] | Unique identifier for the variable definition. | defaults to undefined|


### Return type

**CompleteView**

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully updated |  -  |
|**400** | Bad request. |  -  |
|**404** | Not found |  -  |
|**405** | Not allowed for variable definitions with this status. |  -  |
|**409** | Short name is already in use by another variable definition. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

