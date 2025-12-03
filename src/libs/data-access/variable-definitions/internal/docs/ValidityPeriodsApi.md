# ValidityPeriodsApi

All URIs are relative to *https://metadata.intern.ssb.no*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createValidityPeriod**](#createvalidityperiod) | **POST** /variable-definitions/{variable-definition-id}/validity-periods | Create a new validity period for a variable definition.|
|[**listValidityPeriods**](#listvalidityperiods) | **GET** /variable-definitions/{variable-definition-id}/validity-periods | List all validity periods.|

# **createValidityPeriod**
> CompleteView createValidityPeriod()

Create a new validity period for a variable definition.

### Example

```typescript
import {
    ValidityPeriodsApi,
    Configuration,
    CreateValidityPeriod
} from './api';

const configuration = new Configuration();
const apiInstance = new ValidityPeriodsApi(configuration);

let variableDefinitionId: string; //Unique identifier for the variable definition. (default to undefined)
let createValidityPeriod: CreateValidityPeriod; // (optional)

const { status, data } = await apiInstance.createValidityPeriod(
    variableDefinitionId,
    createValidityPeriod
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createValidityPeriod** | **CreateValidityPeriod**|  | |
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
|**201** | Successfully created. |  -  |
|**404** | Not found |  -  |
|**400** | Bad request. |  -  |
|**405** | Not allowed for variable definitions with this status. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listValidityPeriods**
> Array<CompleteView> listValidityPeriods()

List all validity periods.

### Example

```typescript
import {
    ValidityPeriodsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ValidityPeriodsApi(configuration);

let variableDefinitionId: string; //Unique identifier for the variable definition. (default to undefined)

const { status, data } = await apiInstance.listValidityPeriods(
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

