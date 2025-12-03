# PatchesApi

All URIs are relative to *https://metadata.intern.ssb.no*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createPatch**](#createpatch) | **POST** /variable-definitions/{variable-definition-id}/patches | Create a new patch for a variable definition.|
|[**getPatch**](#getpatch) | **GET** /variable-definitions/{variable-definition-id}/patches/{patch-id} | Get one concrete patch for the given variable definition.|
|[**listPatches**](#listpatches) | **GET** /variable-definitions/{variable-definition-id}/patches | List all patches for the given variable definition.|

# **createPatch**
> CompleteView createPatch()

Create a new patch for a variable definition.

### Example

```typescript
import {
    PatchesApi,
    Configuration,
    CreatePatch
} from './api';

const configuration = new Configuration();
const apiInstance = new PatchesApi(configuration);

let variableDefinitionId: string; //Unique identifier for the variable definition. (default to undefined)
let validFrom: string; //Valid from date for the specific validity period to be patched. (optional) (default to undefined)
let createPatch: CreatePatch; // (optional)

const { status, data } = await apiInstance.createPatch(
    variableDefinitionId,
    validFrom,
    createPatch
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPatch** | **CreatePatch**|  | |
| **variableDefinitionId** | [**string**] | Unique identifier for the variable definition. | defaults to undefined|
| **validFrom** | [**string**] | Valid from date for the specific validity period to be patched. | (optional) defaults to undefined|


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
|**404** | Not found |  -  |
|**400** | Bad request. |  -  |
|**405** | Not allowed for variable definitions with this status. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPatch**
> CompleteView getPatch()

Get one concrete patch for the given variable definition. The full object is returned for comparison purposes.

### Example

```typescript
import {
    PatchesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatchesApi(configuration);

let variableDefinitionId: string; //Unique identifier for the variable definition. (default to undefined)
let patchId: number; //ID of the patch to retrieve (default to undefined)

const { status, data } = await apiInstance.getPatch(
    variableDefinitionId,
    patchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variableDefinitionId** | [**string**] | Unique identifier for the variable definition. | defaults to undefined|
| **patchId** | [**number**] | ID of the patch to retrieve | defaults to undefined|


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
|**200** | Ok |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listPatches**
> Array<CompleteView> listPatches()

List all patches for the given variable definition. The full object is returned for comparison purposes.

### Example

```typescript
import {
    PatchesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatchesApi(configuration);

let variableDefinitionId: string; //Unique identifier for the variable definition. (default to undefined)

const { status, data } = await apiInstance.listPatches(
    variableDefinitionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variableDefinitionId** | [**string**] | Unique identifier for the variable definition. | defaults to undefined|


### Return type

**Array<CompleteView>**

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

