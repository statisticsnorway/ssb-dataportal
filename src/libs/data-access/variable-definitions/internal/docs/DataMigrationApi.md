# DataMigrationApi

All URIs are relative to *https://metadata.intern.ssb.no*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createVariableDefinitionFromVarDok**](DataMigrationApi.md#createvariabledefinitionfromvardok) | **POST** /vardok-migration/{vardok-id} | Create a variable definition from a VarDok variable definition. |
| [**getVardefByVardokId**](DataMigrationApi.md#getvardefbyvardokid) | **GET** /vardok-migration/{vardok-id} | Get a variable definition by vardok id. |
| [**getVardokByVardefId**](DataMigrationApi.md#getvardokbyvardefid) | **GET** /vardok-migration/{vardef-id} | Get a vardok id by vardef id. |
| [**listVardokVardefMappings**](DataMigrationApi.md#listvardokvardefmappings) | **GET** /vardok-migration | Get a list of all vardok and vardef id mappings |



## createVariableDefinitionFromVarDok

> CompleteView createVariableDefinitionFromVarDok(vardokId)

Create a variable definition from a VarDok variable definition.

Create a variable definition from a VarDok variable definition.

### Example

```ts
import {
  Configuration,
  DataMigrationApi,
} from '';
import type { CreateVariableDefinitionFromVarDokRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: labid_token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DataMigrationApi(config);

  const body = {
    // string | The ID of the definition in Vardok.
    vardokId: 1607,
  } satisfies CreateVariableDefinitionFromVarDokRequest;

  try {
    const data = await api.createVariableDefinitionFromVarDok(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **vardokId** | `string` | The ID of the definition in Vardok. | [Defaults to `undefined`] |

### Return type

[**CompleteView**](CompleteView.md)

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successfully created. |  -  |
| **400** | Bad request. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getVardefByVardokId

> CompleteView getVardefByVardokId(vardokId)

Get a variable definition by vardok id.

Get a variable definition by vardok id.

### Example

```ts
import {
  Configuration,
  DataMigrationApi,
} from '';
import type { GetVardefByVardokIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DataMigrationApi();

  const body = {
    // string | The ID of the definition in Vardok.
    vardokId: 1607,
  } satisfies GetVardefByVardokIdRequest;

  try {
    const data = await api.getVardefByVardokId(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **vardokId** | `string` | The ID of the definition in Vardok. | [Defaults to `undefined`] |

### Return type

[**CompleteView**](CompleteView.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK response |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getVardokByVardefId

> VardokIdResponse getVardokByVardefId(vardefId)

Get a vardok id by vardef id.

Get a vardok id by vardef id.

### Example

```ts
import {
  Configuration,
  DataMigrationApi,
} from '';
import type { GetVardokByVardefIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DataMigrationApi();

  const body = {
    // string | The ID of a variable definition which has been migrated.
    vardefId: wypvb3wd,
  } satisfies GetVardokByVardefIdRequest;

  try {
    const data = await api.getVardokByVardefId(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **vardefId** | `string` | The ID of a variable definition which has been migrated. | [Defaults to `undefined`] |

### Return type

[**VardokIdResponse**](VardokIdResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not found |  -  |
| **200** | OK response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listVardokVardefMappings

> Array&lt;VardokVardefIdPairResponse&gt; listVardokVardefMappings()

Get a list of all vardok and vardef id mappings

Get a list of all vardok and vardef id mappings

### Example

```ts
import {
  Configuration,
  DataMigrationApi,
} from '';
import type { ListVardokVardefMappingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DataMigrationApi();

  try {
    const data = await api.listVardokVardefMappings();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;VardokVardefIdPairResponse&gt;**](VardokVardefIdPairResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

