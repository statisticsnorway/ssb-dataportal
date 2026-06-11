# SearchApi

All URIs are relative to *https://data.ssb.no*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**search**](SearchApi.md#search) | **GET** /api/klass/v1/classifications/search |  |



## search

> KlassPagedResourcesSearchResultResource search(query, ssbSection, includeCodelists)



### Example

```ts
import {
  Configuration,
  SearchApi,
} from '';
import type { SearchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SearchApi();

  const body = {
    // string
    query: query_example,
    // string (optional)
    ssbSection: ssbSection_example,
    // boolean (optional)
    includeCodelists: true,
  } satisfies SearchRequest;

  try {
    const data = await api.search(body);
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
| **query** | `string` |  | [Defaults to `undefined`] |
| **ssbSection** | `string` |  | [Optional] [Defaults to `undefined`] |
| **includeCodelists** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**KlassPagedResourcesSearchResultResource**](KlassPagedResourcesSearchResultResource.md)

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

