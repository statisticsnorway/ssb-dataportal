# DataFilesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createOrUpdateDaplaDataFile**](DataFilesApi.md#createorupdatedapladatafile) | **POST** /data-files |  |
| [**getDataFileByFilePath**](DataFilesApi.md#getdatafilebyfilepath) | **GET** /data-files/{file-path} |  |
| [**listDataFiles**](DataFilesApi.md#listdatafiles) | **GET** /data-files |  |



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
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: metamapper-datadoc-m2m
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DataFilesApi(config);

  const body = {
    // CreateDaplaDataFile
    createDaplaDataFile: {"file_path":"gs://ssb-staging-dapla-felles-data-delt/datadoc/utdata/person-data_p2021_p2022_v2.parquet"},
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

[metamapper-datadoc-m2m](../README.md#metamapper-datadoc-m2m)

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
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DataFilesApi(config);

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

[keycloak-token](../README.md#keycloak-token)

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

> Array&lt;DaplaDataFileDTO&gt; listDataFiles(datasetId)



### Example

```ts
import {
  Configuration,
  DataFilesApi,
} from '';
import type { ListDataFilesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DataFilesApi(config);

  const body = {
    // string (optional)
    datasetId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
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

### Return type

[**Array&lt;DaplaDataFileDTO&gt;**](DaplaDataFileDTO.md)

### Authorization

[keycloak-token](../README.md#keycloak-token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List Dapla Data Files. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

