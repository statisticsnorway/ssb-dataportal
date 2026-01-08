# ClassificationFamiliesApi

All URIs are relative to *https://data.ssb.no/api/klass*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**classificationFamilies**](ClassificationFamiliesApi.md#classificationfamilies) | **GET** /v1/classificationfamilies |  |
| [**classificationFamily**](ClassificationFamiliesApi.md#classificationfamily) | **GET** /v1/classificationfamilies/{id} |  |



## classificationFamilies

> CollectionModelClassificationFamilySummaryResource classificationFamilies(ssbSection, includeCodelists, language)



### Example

```ts
import {
  Configuration,
  ClassificationFamiliesApi,
} from '';
import type { ClassificationFamiliesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClassificationFamiliesApi();

  const body = {
    // string (optional)
    ssbSection: ssbSection_example,
    // boolean (optional)
    includeCodelists: true,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
  } satisfies ClassificationFamiliesRequest;

  try {
    const data = await api.classificationFamilies(body);
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
| **ssbSection** | `string` |  | [Optional] [Defaults to `undefined`] |
| **includeCodelists** | `boolean` |  | [Optional] [Defaults to `false`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `&#39;nb&#39;`] [Enum: NB, NN, EN] |

### Return type

[**CollectionModelClassificationFamilySummaryResource**](CollectionModelClassificationFamilySummaryResource.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `application/json`, `text/xml`, `application/xml`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **500** | Internal Server Error |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## classificationFamily

> ClassificationFamilyResource classificationFamily(id, ssbSection, includeCodelists, language)



### Example

```ts
import {
  Configuration,
  ClassificationFamiliesApi,
} from '';
import type { ClassificationFamilyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClassificationFamiliesApi();

  const body = {
    // number
    id: 789,
    // string (optional)
    ssbSection: ssbSection_example,
    // boolean (optional)
    includeCodelists: true,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
  } satisfies ClassificationFamilyRequest;

  try {
    const data = await api.classificationFamily(body);
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
| **ssbSection** | `string` |  | [Optional] [Defaults to `undefined`] |
| **includeCodelists** | `boolean` |  | [Optional] [Defaults to `false`] |
| **language** | `NB`, `NN`, `EN` |  | [Optional] [Defaults to `&#39;nb&#39;`] [Enum: NB, NN, EN] |

### Return type

[**ClassificationFamilyResource**](ClassificationFamilyResource.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/problem+json`, `application/json`, `text/xml`, `application/xml`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **500** | Internal Server Error |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

