# DatasetsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteDatasetById**](DatasetsApi.md#deletedatasetbyid) | **DELETE** /datasets/{id} | Delete a dataset. |
| [**getDatasetById**](DatasetsApi.md#getdatasetbyid) | **GET** /datasets/{id} |  |
| [**listDatasets**](DatasetsApi.md#listdatasets) | **GET** /datasets |  |



## deleteDatasetById

> deleteDatasetById(id)

Delete a dataset.

Delete a dataset. Also deletes the data files which make up this dataset. May delete a data product if this is the only dataset which is part of the product.

### Example

```ts
import {
  Configuration,
  DatasetsApi,
} from '';
import type { DeleteDatasetByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DatasetsApi(config);

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteDatasetByIdRequest;

  try {
    const data = await api.deleteDatasetById(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[keycloak-token](../README.md#keycloak-token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Delete a Dataset by ID. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getDatasetById

> DatasetDTO getDatasetById(id)



### Example

```ts
import {
  Configuration,
  DatasetsApi,
} from '';
import type { GetDatasetByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DatasetsApi(config);

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetDatasetByIdRequest;

  try {
    const data = await api.getDatasetById(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DatasetDTO**](DatasetDTO.md)

### Authorization

[keycloak-token](../README.md#keycloak-token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Get a Dataset by ID. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDatasets

> Array&lt;DatasetDTO&gt; listDatasets(productShortName)



### Example

```ts
import {
  Configuration,
  DatasetsApi,
} from '';
import type { ListDatasetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DatasetsApi(config);

  const body = {
    // string (optional)
    productShortName: productShortName_example,
  } satisfies ListDatasetsRequest;

  try {
    const data = await api.listDatasets(body);
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
| **productShortName** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;DatasetDTO&gt;**](DatasetDTO.md)

### Authorization

[keycloak-token](../README.md#keycloak-token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List Datasets. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

