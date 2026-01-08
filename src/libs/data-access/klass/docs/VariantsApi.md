# VariantsApi

All URIs are relative to *https://data.ssb.no/api/klass*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**variant**](VariantsApi.md#variant) | **GET** /v1/classifications/{id}/variant |  |
| [**variantAt**](VariantsApi.md#variantat) | **GET** /v1/classifications/{id}/variantAt |  |
| [**variants**](VariantsApi.md#variants) | **GET** /v1/variants/{id} |  |



## variant

> CodeList variant(id, variantName, from, to, csvSeparator, csvFields, level, selectCodes, presentationNamePattern, language, includeFuture)



### Example

```ts
import {
  Configuration,
  VariantsApi,
} from '';
import type { VariantRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VariantsApi();

  const body = {
    // number
    id: 789,
    // string
    variantName: variantName_example,
    // Date
    from: 2013-10-20,
    // Date (optional)
    to: 2013-10-20,
    // string (optional)
    csvSeparator: csvSeparator_example,
    // string (optional)
    csvFields: csvFields_example,
    // string (optional)
    level: level_example,
    // string (optional)
    selectCodes: selectCodes_example,
    // string (optional)
    presentationNamePattern: presentationNamePattern_example,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
    // boolean (optional)
    includeFuture: true,
  } satisfies VariantRequest;

  try {
    const data = await api.variant(body);
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
| **variantName** | `string` |  | [Defaults to `undefined`] |
| **from** | `Date` |  | [Defaults to `undefined`] |
| **to** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **csvSeparator** | `string` |  | [Optional] [Defaults to `&#39;,&#39;`] |
| **csvFields** | `string` |  | [Optional] [Defaults to `&#39;&#39;`] |
| **level** | `string` |  | [Optional] [Defaults to `undefined`] |
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


## variantAt

> CodeList variantAt(id, variantName, date, csvSeparator, csvFields, level, selectCodes, presentationNamePattern, language, includeFuture)



### Example

```ts
import {
  Configuration,
  VariantsApi,
} from '';
import type { VariantAtRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VariantsApi();

  const body = {
    // number
    id: 789,
    // string
    variantName: variantName_example,
    // Date (optional)
    date: 2013-10-20,
    // string (optional)
    csvSeparator: csvSeparator_example,
    // string (optional)
    csvFields: csvFields_example,
    // string (optional)
    level: level_example,
    // string (optional)
    selectCodes: selectCodes_example,
    // string (optional)
    presentationNamePattern: presentationNamePattern_example,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
    // boolean (optional)
    includeFuture: true,
  } satisfies VariantAtRequest;

  try {
    const data = await api.variantAt(body);
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
| **variantName** | `string` |  | [Defaults to `undefined`] |
| **date** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **csvSeparator** | `string` |  | [Optional] [Defaults to `&#39;,&#39;`] |
| **csvFields** | `string` |  | [Optional] [Defaults to `&#39;&#39;`] |
| **level** | `string` |  | [Optional] [Defaults to `undefined`] |
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


## variants

> ClassificationVariantResource variants(id, language)



### Example

```ts
import {
  Configuration,
  VariantsApi,
} from '';
import type { VariantsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VariantsApi();

  const body = {
    // number
    id: 789,
    // 'NB' | 'NN' | 'EN' (optional)
    language: language_example,
  } satisfies VariantsRequest;

  try {
    const data = await api.variants(body);
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

[**ClassificationVariantResource**](ClassificationVariantResource.md)

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

