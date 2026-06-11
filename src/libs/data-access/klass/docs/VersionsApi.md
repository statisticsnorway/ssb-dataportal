# VersionsApi

All URIs are relative to *https://data.ssb.no*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**versions**](VersionsApi.md#versions) | **GET** /api/klass/v1/versions/{id} |  |



## versions

> ClassificationVersionResource versions(id, language, includeFuture)



### Example

```ts
import {
  Configuration,
  VersionsApi,
} from '';
import type { VersionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VersionsApi();

  const body = {
    // number
    id: 789,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
    // boolean (optional)
    includeFuture: true,
  } satisfies VersionsRequest;

  try {
    const data = await api.versions(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `&#39;nb&#39;`] [Enum: NB, NN, EN] |
| **includeFuture** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**ClassificationVersionResource**](ClassificationVersionResource.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `*/*`, `application/json`, `application/xml`, `text/xml`, `text/csv`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **500** | Internal Server Error |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

