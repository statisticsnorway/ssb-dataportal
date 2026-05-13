# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createOrUpdateDaplaDataFile**](DefaultApi.md#createorupdatedapladatafile) | **POST** /data-files |  |
| [**getByFilePath**](DefaultApi.md#getbyfilepath) | **GET** /data-files/{filePath} |  |
| [**getById**](DefaultApi.md#getbyid) | **GET** /datasets/{id} |  |
| [**getByShortName**](DefaultApi.md#getbyshortname) | **GET** /data-products/{shortName} |  |
| [**listDaplaDataFiles**](DefaultApi.md#listdapladatafiles) | **GET** /data-files |  |
| [**listDataProducts**](DefaultApi.md#listdataproducts) | **GET** /data-products |  |
| [**listDatasets**](DefaultApi.md#listdatasets) | **GET** /datasets |  |



## createOrUpdateDaplaDataFile

> createOrUpdateDaplaDataFile(createDaplaDataFile)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { CreateOrUpdateDaplaDataFileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // CreateDaplaDataFile
    createDaplaDataFile: ...,
  } satisfies CreateOrUpdateDaplaDataFileRequest;

  try {
    const data = await api.createOrUpdateDaplaDataFile(body);
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
| **createDaplaDataFile** | [CreateDaplaDataFile](CreateDaplaDataFile.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The Dapla Data File did not previously exist but has now been created. |  -  |
| **200** | The Dapla Data File already exists and was updated with the supplied data. |  -  |
| **400** | Bad request. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getByFilePath

> DaplaDataFileDTO getByFilePath(filePath)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetByFilePathRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    filePath: filePath_example,
  } satisfies GetByFilePathRequest;

  try {
    const data = await api.getByFilePath(body);
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
| **filePath** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DaplaDataFileDTO**](DaplaDataFileDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Get the Dapla Data File by its file path. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getById

> DatasetDTO getById(id)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetByIdRequest;

  try {
    const data = await api.getById(body);
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


## getByShortName

> DataProductDTO getByShortName(shortName)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetByShortNameRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    shortName: shortName_example,
  } satisfies GetByShortNameRequest;

  try {
    const data = await api.getByShortName(body);
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
| **shortName** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DataProductDTO**](DataProductDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Get the Data Product by its short name. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDaplaDataFiles

> listDaplaDataFiles()



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ListDaplaDataFilesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.listDaplaDataFiles();
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

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List Dapla Data Files. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDataProducts

> Array&lt;DataProductDTO&gt; listDataProducts(productType)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ListDataProductsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // DataProductType (optional)
    productType: ...,
  } satisfies ListDataProductsRequest;

  try {
    const data = await api.listDataProducts(body);
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
| **productType** | `DataProductType` |  | [Optional] [Defaults to `undefined`] [Enum: OTHER_DATA_PRODUCT, STATISTIC_PRODUCT] |

### Return type

[**Array&lt;DataProductDTO&gt;**](DataProductDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List Data Products. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDatasets

> Array&lt;DatasetDTO&gt; listDatasets(productShortName)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ListDatasetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

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

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List Datasets. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

