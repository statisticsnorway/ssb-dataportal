# CodesApi

All URIs are relative to *https://data.ssb.no/api/klass*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**changes**](CodesApi.md#changes) | **GET** /v1/classifications/{id}/changes |  |
| [**codes**](CodesApi.md#codes) | **GET** /v1/classifications/{id}/codes |  |
| [**codesAt**](CodesApi.md#codesat) | **GET** /v1/classifications/{id}/codesAt |  |



## changes

> CodeChangeList changes(id, from, to, csvSeparator, csvFields, language, includeFuture)



### Example

```ts
import {
  Configuration,
  CodesApi,
} from '';
import type { ChangesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CodesApi();

  const body = {
    // number
    id: 789,
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
  } satisfies ChangesRequest;

  try {
    const data = await api.changes(body);
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
| **from** | `Date` |  | [Defaults to `undefined`] |
| **to** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **csvSeparator** | `string` |  | [Optional] [Defaults to `&#39;,&#39;`] |
| **csvFields** | `string` |  | [Optional] [Defaults to `&#39;&#39;`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `&#39;nb&#39;`] [Enum: NB, NN, EN] |
| **includeFuture** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**CodeChangeList**](CodeChangeList.md)

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


## codes

> CodeList codes(id, from, to, csvSeparator, csvFields, selectLevel, selectCodes, presentationNamePattern, language, includeFuture)



### Example

```ts
import {
  Configuration,
  CodesApi,
} from '';
import type { CodesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CodesApi();

  const body = {
    // number
    id: 789,
    // Date
    from: 2013-10-20,
    // Date (optional)
    to: 2013-10-20,
    // string (optional)
    csvSeparator: csvSeparator_example,
    // string (optional)
    csvFields: csvFields_example,
    // string (optional)
    selectLevel: selectLevel_example,
    // string (optional)
    selectCodes: selectCodes_example,
    // string (optional)
    presentationNamePattern: presentationNamePattern_example,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
    // boolean (optional)
    includeFuture: true,
  } satisfies CodesRequest;

  try {
    const data = await api.codes(body);
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
| **from** | `Date` |  | [Defaults to `undefined`] |
| **to** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **csvSeparator** | `string` |  | [Optional] [Defaults to `&#39;,&#39;`] |
| **csvFields** | `string` |  | [Optional] [Defaults to `&#39;&#39;`] |
| **selectLevel** | `string` |  | [Optional] [Defaults to `undefined`] |
| **selectCodes** | `string` |  | [Optional] [Defaults to `undefined`] |
| **presentationNamePattern** | `string` |  | [Optional] [Defaults to `undefined`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `&#39;nb&#39;`] [Enum: NB, NN, EN] |
| **includeFuture** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**CodeList**](CodeList.md)

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


## codesAt

> CodeList codesAt(id, date, csvSeparator, csvFields, selectLevel, selectCodes, presentationNamePattern, language, includeFuture)



### Example

```ts
import {
  Configuration,
  CodesApi,
} from '';
import type { CodesAtRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CodesApi();

  const body = {
    // number
    id: 789,
    // Date
    date: 2013-10-20,
    // string (optional)
    csvSeparator: csvSeparator_example,
    // string (optional)
    csvFields: csvFields_example,
    // string (optional)
    selectLevel: selectLevel_example,
    // string (optional)
    selectCodes: selectCodes_example,
    // string (optional)
    presentationNamePattern: presentationNamePattern_example,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
    // boolean (optional)
    includeFuture: true,
  } satisfies CodesAtRequest;

  try {
    const data = await api.codesAt(body);
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
| **date** | `Date` |  | [Defaults to `undefined`] |
| **csvSeparator** | `string` |  | [Optional] [Defaults to `&#39;,&#39;`] |
| **csvFields** | `string` |  | [Optional] [Defaults to `&#39;&#39;`] |
| **selectLevel** | `string` |  | [Optional] [Defaults to `undefined`] |
| **selectCodes** | `string` |  | [Optional] [Defaults to `undefined`] |
| **presentationNamePattern** | `string` |  | [Optional] [Defaults to `undefined`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `&#39;nb&#39;`] [Enum: NB, NN, EN] |
| **includeFuture** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**CodeList**](CodeList.md)

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

