# DatasetsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteDatasetById**](DatasetsApi.md#deletedatasetbyid) | **DELETE** /datasets/{id} | Delete a dataset. |
| [**getDatasetById**](DatasetsApi.md#getdatasetbyid) | **GET** /datasets/{id} |  |
| [**listDatasetVariables**](DatasetsApi.md#listdatasetvariables) | **GET** /datasets/{id}/variables |  |
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
  const api = new DatasetsApi();

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

No authorization required

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
  const api = new DatasetsApi();

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

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Get a Dataset by ID. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDatasetVariables

> DatasetVariablePageResponse listDatasetVariables(id, page, pageSize)



### Example

```ts
import {
  Configuration,
  DatasetsApi,
} from '';
import type { ListDatasetVariablesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DatasetsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // number (optional)
    page: 56,
    // number (optional)
    pageSize: 56,
  } satisfies ListDatasetVariablesRequest;

  try {
    const data = await api.listDatasetVariables(body);
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
| **page** | `number` |  | [Optional] [Defaults to `0`] |
| **pageSize** | `number` |  | [Optional] [Defaults to `100`] |

### Return type

[**DatasetVariablePageResponse**](DatasetVariablePageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List the variables belonging to a dataset. |  -  |
| **400** | Bad request. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDatasets

> DatasetPageResponse listDatasets(productShortName, storageLocation, storageCategory, page, pageSize)



### Example

```ts
import {
  Configuration,
  DatasetsApi,
} from '';
import type { ListDatasetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DatasetsApi();

  const body = {
    // string (optional)
    productShortName: productShortName_example,
    // string (optional)
    storageLocation: storageLocation_example,
    // StorageCategory (optional)
    storageCategory: ...,
    // number (optional)
    page: 56,
    // number (optional)
    pageSize: 56,
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
| **storageLocation** | `string` |  | [Optional] [Defaults to `undefined`] |
| **storageCategory** | `StorageCategory` |  | [Optional] [Defaults to `undefined`] [Enum: SOURCE, PRODUCT, SHARED] |
| **page** | `number` |  | [Optional] [Defaults to `0`] |
| **pageSize** | `number` |  | [Optional] [Defaults to `100`] |

### Return type

[**DatasetPageResponse**](DatasetPageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List Datasets. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

