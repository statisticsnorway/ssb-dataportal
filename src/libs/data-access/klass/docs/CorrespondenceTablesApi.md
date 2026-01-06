# CorrespondenceTablesApi

All URIs are relative to *https://data.ssb.no/api/klass*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**correspondenceTables**](CorrespondenceTablesApi.md#correspondencetables) | **GET** /v1/correspondencetables/{id} |  |
| [**corresponds**](CorrespondenceTablesApi.md#corresponds) | **GET** /v1/classifications/{id}/corresponds |  |
| [**correspondsAt**](CorrespondenceTablesApi.md#correspondsat) | **GET** /v1/classifications/{id}/correspondsAt |  |



## correspondenceTables

> CorrespondenceTableResource correspondenceTables(id, language)



### Example

```ts
import {
  Configuration,
  CorrespondenceTablesApi,
} from '';
import type { CorrespondenceTablesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CorrespondenceTablesApi();

  const body = {
    // number
    id: 789,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
  } satisfies CorrespondenceTablesRequest;

  try {
    const data = await api.correspondenceTables(body);
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

### Return type

[**CorrespondenceTableResource**](CorrespondenceTableResource.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `application/json`, `application/xml`, `text/xml`, `text/csv`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **500** | Internal Server Error |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## corresponds

> CorrespondenceItemList corresponds(id, targetClassificationId, from, to, csvSeparator, csvFields, language, includeFuture)



### Example

```ts
import {
  Configuration,
  CorrespondenceTablesApi,
} from '';
import type { CorrespondsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CorrespondenceTablesApi();

  const body = {
    // number
    id: 789,
    // number
    targetClassificationId: 789,
    // Date
    from: 2013-10-20,
    // Date (optional)
    to: 2013-10-20,
    // string (optional)
    csvSeparator: csvSeparator_example,
    // string (optional)
    csvFields: csvFields_example,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
    // boolean (optional)
    includeFuture: true,
  } satisfies CorrespondsRequest;

  try {
    const data = await api.corresponds(body);
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
| **targetClassificationId** | `number` |  | [Defaults to `undefined`] |
| **from** | `Date` |  | [Defaults to `undefined`] |
| **to** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **csvSeparator** | `string` |  | [Optional] [Defaults to `&#39;,&#39;`] |
| **csvFields** | `string` |  | [Optional] [Defaults to `&#39;&#39;`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `&#39;nb&#39;`] [Enum: NB, NN, EN] |
| **includeFuture** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**CorrespondenceItemList**](CorrespondenceItemList.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `application/json`, `application/xml`, `text/xml`, `text/csv`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **500** | Internal Server Error |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## correspondsAt

> CorrespondenceItemList correspondsAt(id, targetClassificationId, date, csvSeparator, csvFields, language, includeFuture, inverted)



### Example

```ts
import {
  Configuration,
  CorrespondenceTablesApi,
} from '';
import type { CorrespondsAtRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CorrespondenceTablesApi();

  const body = {
    // number
    id: 789,
    // number
    targetClassificationId: 789,
    // Date (optional)
    date: 2013-10-20,
    // string (optional)
    csvSeparator: csvSeparator_example,
    // string (optional)
    csvFields: csvFields_example,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
    // boolean (optional)
    includeFuture: true,
    // boolean (optional)
    inverted: true,
  } satisfies CorrespondsAtRequest;

  try {
    const data = await api.correspondsAt(body);
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
| **targetClassificationId** | `number` |  | [Defaults to `undefined`] |
| **date** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **csvSeparator** | `string` |  | [Optional] [Defaults to `&#39;,&#39;`] |
| **csvFields** | `string` |  | [Optional] [Defaults to `&#39;&#39;`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `&#39;nb&#39;`] [Enum: NB, NN, EN] |
| **includeFuture** | `boolean` |  | [Optional] [Defaults to `false`] |
| **inverted** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**CorrespondenceItemList**](CorrespondenceItemList.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `application/json`, `application/xml`, `text/xml`, `text/csv`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **500** | Internal Server Error |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

