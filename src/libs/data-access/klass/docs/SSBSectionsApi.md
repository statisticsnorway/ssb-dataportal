# SSBSectionsApi

All URIs are relative to *https://data.ssb.no/api/klass*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**ssbsections**](SSBSectionsApi.md#ssbsections) | **GET** /v1/ssbsections |  |



## ssbsections

> CollectionModelSsbSectionResource ssbsections()



### Example

```ts
import {
  Configuration,
  SSBSectionsApi,
} from '';
import type { SsbsectionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SSBSectionsApi();

  try {
    const data = await api.ssbsections();
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

[**CollectionModelSsbSectionResource**](CollectionModelSsbSectionResource.md)

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

