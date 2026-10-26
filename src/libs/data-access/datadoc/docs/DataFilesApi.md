# DataFilesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createOrUpdateDaplaDataFile**](DataFilesApi.md#createorupdatedapladatafile) | **POST** /data-files |  |
| [**getDataFileByFilePath**](DataFilesApi.md#getdatafilebyfilepath) | **GET** /data-files/{file-path} |  |
| [**listDataFiles**](DataFilesApi.md#listdatafiles) | **GET** /data-files |  |
| [**registerDataFileVariables**](DataFilesApi.md#registerdatafilevariables) | **POST** /data-files/{file-path}/variables |  |



## createOrUpdateDaplaDataFile

> createOrUpdateDaplaDataFile(createDaplaDataFile)



### Example

```ts
import {
  Configuration,
  DataFilesApi,
} from '';
import type { CreateOrUpdateDaplaDataFileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DataFilesApi();

  const body = {
    // CreateDaplaDataFile
    createDaplaDataFile: {"file_path":"gs://ssb-staging-dapla-felles-data-delt/datadoc/utdata/person-data_p2021_p2022_v2.parquet","task_id":"SHARED:PROD:ssb-staging-dapla-felles-data-delt","job_id":"01JD8XQ2"},
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
| **409** | The supplied job is no longer the active task for the bucket. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getDataFileByFilePath

> DaplaDataFileDTO getDataFileByFilePath(filePath)



### Example

```ts
import {
  Configuration,
  DataFilesApi,
} from '';
import type { GetDataFileByFilePathRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DataFilesApi();

  const body = {
    // string
    filePath: filePath_example,
  } satisfies GetDataFileByFilePathRequest;

  try {
    const data = await api.getDataFileByFilePath(body);
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


## listDataFiles

> DaplaDataFilePageResponse listDataFiles(datasetId, storageCategory, page, pageSize)



### Example

```ts
import {
  Configuration,
  DataFilesApi,
} from '';
import type { ListDataFilesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DataFilesApi();

  const body = {
    // string (optional)
    datasetId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // StorageCategory (optional)
    storageCategory: ...,
    // number (optional)
    page: 56,
    // number (optional)
    pageSize: 56,
  } satisfies ListDataFilesRequest;

  try {
    const data = await api.listDataFiles(body);
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
| **datasetId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **storageCategory** | `StorageCategory` |  | [Optional] [Defaults to `undefined`] [Enum: SOURCE, PRODUCT, SHARED] |
| **page** | `number` |  | [Optional] [Defaults to `0`] |
| **pageSize** | `number` |  | [Optional] [Defaults to `100`] |

### Return type

[**DaplaDataFilePageResponse**](DaplaDataFilePageResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List Dapla Data Files. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## registerDataFileVariables

> registerDataFileVariables(filePath, createDataFileVariables)



### Example

```ts
import {
  Configuration,
  DataFilesApi,
} from '';
import type { RegisterDataFileVariablesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DataFilesApi();

  const body = {
    // string
    filePath: filePath_example,
    // CreateDataFileVariables
    createDataFileVariables: {"variables":[{"name":"person_id","repetition_type":"REQUIRED","physical_type":"INT64"},{"name":"tags","repetition_type":"OPTIONAL","logical_type":{"type":"LIST"},"children":[{"name":"list","repetition_type":"REPEATED","children":[{"name":"element","repetition_type":"OPTIONAL","physical_type":"BYTE_ARRAY","logical_type":{"type":"STRING"}}]}]}]},
  } satisfies RegisterDataFileVariablesRequest;

  try {
    const data = await api.registerDataFileVariables(body);
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
| **createDataFileVariables** | [CreateDataFileVariables](CreateDataFileVariables.md) |  | |

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
| **200** | The data file exists and the variables passed validation and were persisted. |  -  |
| **500** | An unexpected server error occurred. |  -  |
| **400** | Bad request. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

