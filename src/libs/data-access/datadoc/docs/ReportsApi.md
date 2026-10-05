# ReportsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**namingViolations**](ReportsApi.md#namingviolations) | **GET** /reports/naming-violations |  |
| [**rejectedDataFiles**](ReportsApi.md#rejecteddatafiles) | **GET** /reports/rejected-files |  |



## namingViolations

> NamingViolations200Response namingViolations(includeViolations)



### Example

```ts
import {
  Configuration,
  ReportsApi,
} from '';
import type { NamingViolationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportsApi(config);

  const body = {
    // boolean (optional)
    includeViolations: true,
  } satisfies NamingViolationsRequest;

  try {
    const data = await api.namingViolations(body);
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
| **includeViolations** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**NamingViolations200Response**](NamingViolations200Response.md)

### Authorization

[keycloak-token](../README.md#keycloak-token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Naming violation report |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## rejectedDataFiles

> NamingViolations200Response rejectedDataFiles(includeViolations)



### Example

```ts
import {
  Configuration,
  ReportsApi,
} from '';
import type { RejectedDataFilesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportsApi(config);

  const body = {
    // boolean (optional)
    includeViolations: true,
  } satisfies RejectedDataFilesRequest;

  try {
    const data = await api.rejectedDataFiles(body);
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
| **includeViolations** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

[**NamingViolations200Response**](NamingViolations200Response.md)

### Authorization

[keycloak-token](../README.md#keycloak-token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Rejected files report |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

