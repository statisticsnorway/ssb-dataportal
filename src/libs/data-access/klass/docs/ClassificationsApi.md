# ClassificationsApi

All URIs are relative to *https://data.ssb.no*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**classification**](ClassificationsApi.md#classification) | **GET** /api/klass/v1/classifications/{id} |  |
| [**classifications**](ClassificationsApi.md#classifications) | **GET** /api/klass/v1/classifications |  |



## classification

> ClassificationResource classification(id, language, includeFuture)



### Example

```ts
import {
  Configuration,
  ClassificationsApi,
} from '';
import type { ClassificationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClassificationsApi();

  const body = {
    // number
    id: 789,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
    // boolean (optional)
    includeFuture: true,
  } satisfies ClassificationRequest;

  try {
    const data = await api.classification(body);
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

[**ClassificationResource**](ClassificationResource.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `*/*`, `application/json`, `text/xml`, `application/xml`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **500** | Internal Server Error |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## classifications

> KlassPagedResourcesClassificationSummaryResource classifications(includeCodelists, includeDescription, changedSince, language)



### Example

```ts
import {
  Configuration,
  ClassificationsApi,
} from '';
import type { ClassificationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClassificationsApi();

  const body = {
    // boolean (optional)
    includeCodelists: true,
    // boolean (optional)
    includeDescription: true,
    // Date (optional)
    changedSince: 2013-10-20T19:20:30+01:00,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
  } satisfies ClassificationsRequest;

  try {
    const data = await api.classifications(body);
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
| **includeCodelists** | `boolean` |  | [Optional] [Defaults to `false`] |
| **includeDescription** | `boolean` |  | [Optional] [Defaults to `false`] |
| **changedSince** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `undefined`] [Enum: NB, NN, EN] |

### Return type

[**KlassPagedResourcesClassificationSummaryResource**](KlassPagedResourcesClassificationSummaryResource.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `*/*`, `application/json`, `text/xml`, `application/xml`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **500** | Internal Server Error |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

