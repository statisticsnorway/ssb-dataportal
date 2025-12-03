# DataMigrationApi

All URIs are relative to *https://metadata.intern.ssb.no*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createVariableDefinitionFromVarDok**](#createvariabledefinitionfromvardok) | **POST** /vardok-migration/{vardok-id} | Create a variable definition from a VarDok variable definition.|
|[**getVardokVardefMapping**](#getvardokvardefmapping) | **GET** /vardok-migration | Get a list of all vardok and vardef id mappings|
|[**getVardokVardefMappingById**](#getvardokvardefmappingbyid) | **GET** /vardok-migration/{id} | Get one variable definition by vardok id or get the vardok id by vardef id.|

# **createVariableDefinitionFromVarDok**
> CompleteView createVariableDefinitionFromVarDok()

Create a variable definition from a VarDok variable definition.

### Example

```typescript
import {
    DataMigrationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DataMigrationApi(configuration);

let vardokId: string; //The ID of the definition in Vardok. (default to undefined)

const { status, data } = await apiInstance.createVariableDefinitionFromVarDok(
    vardokId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vardokId** | [**string**] | The ID of the definition in Vardok. | defaults to undefined|


### Return type

**CompleteView**

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successfully created. |  -  |
|**400** | Bad request. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getVardokVardefMapping**
> Array<VardokVardefIdPairResponse> getVardokVardefMapping()

Get a list of all vardok and vardef id mappings

### Example

```typescript
import {
    DataMigrationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DataMigrationApi(configuration);

const { status, data } = await apiInstance.getVardokVardefMapping();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<VardokVardefIdPairResponse>**

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

# **getVardokVardefMappingById**
> GetVardokVardefMappingById200Response getVardokVardefMappingById()

Get one variable definition by vardok id or get the vardok id by vardef id.

### Example

```typescript
import {
    DataMigrationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DataMigrationApi(configuration);

let id: string; //The ID of the definition in Vardok or Vardef. (default to undefined)

const { status, data } = await apiInstance.getVardokVardefMappingById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the definition in Vardok or Vardef. | defaults to undefined|


### Return type

**GetVardokVardefMappingById200Response**

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

