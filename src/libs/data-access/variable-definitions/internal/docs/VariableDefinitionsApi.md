# VariableDefinitionsApi

All URIs are relative to *https://metadata.intern.ssb.no*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getVariableDefinitionById**](#getvariabledefinitionbyid) | **GET** /variable-definitions/{variable-definition-id} | Get one variable definition.|
|[**listVariableDefinitions**](#listvariabledefinitions) | **GET** /variable-definitions | List all variable definitions.|

# **getVariableDefinitionById**
> ListVariableDefinitions200ResponseInner getVariableDefinitionById()

Get one variable definition.

### Example

```typescript
import {
    VariableDefinitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariableDefinitionsApi(configuration);

let acceptLanguage: SupportedLanguages; //Render the variable definition in the given language. (default to undefined)
let variableDefinitionId: string; //Unique identifier for the variable definition. (default to undefined)
let dateOfValidity: string; //List only variable definitions which are valid on this date. (optional) (default to undefined)
let render: boolean; //Render the Variable Definition for presentation in a frontend (optional) (default to undefined)

const { status, data } = await apiInstance.getVariableDefinitionById(
    acceptLanguage,
    variableDefinitionId,
    dateOfValidity,
    render
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **acceptLanguage** | **SupportedLanguages** | Render the variable definition in the given language. | defaults to undefined|
| **variableDefinitionId** | [**string**] | Unique identifier for the variable definition. | defaults to undefined|
| **dateOfValidity** | [**string**] | List only variable definitions which are valid on this date. | (optional) defaults to undefined|
| **render** | [**boolean**] | Render the Variable Definition for presentation in a frontend | (optional) defaults to undefined|


### Return type

**ListVariableDefinitions200ResponseInner**

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listVariableDefinitions**
> Array<ListVariableDefinitions200ResponseInner> listVariableDefinitions()

List all variable definitions.

### Example

```typescript
import {
    VariableDefinitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariableDefinitionsApi(configuration);

let acceptLanguage: SupportedLanguages; //Render the variable definition in the given language. (default to undefined)
let dateOfValidity: string; //List only variable definitions which are valid on this date. (optional) (default to undefined)
let shortName: string; //List only the variable definition with the given short name. (optional) (default to undefined)
let render: boolean; //Render the Variable Definition for presentation in a frontend (optional) (default to undefined)

const { status, data } = await apiInstance.listVariableDefinitions(
    acceptLanguage,
    dateOfValidity,
    shortName,
    render
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **acceptLanguage** | **SupportedLanguages** | Render the variable definition in the given language. | defaults to undefined|
| **dateOfValidity** | [**string**] | List only variable definitions which are valid on this date. | (optional) defaults to undefined|
| **shortName** | [**string**] | List only the variable definition with the given short name. | (optional) defaults to undefined|
| **render** | [**boolean**] | Render the Variable Definition for presentation in a frontend | (optional) defaults to undefined|


### Return type

**Array<ListVariableDefinitions200ResponseInner>**

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

