# DataProductsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getDataProductByShortName**](DataProductsApi.md#getdataproductbyshortname) | **GET** /data-products/{short-name} |  |
| [**listDataProducts**](DataProductsApi.md#listdataproducts) | **GET** /data-products |  |



## getDataProductByShortName

> DataProductDTO getDataProductByShortName(shortName)



### Example

```ts
import {
  Configuration,
  DataProductsApi,
} from '';
import type { GetDataProductByShortNameRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DataProductsApi(config);

  const body = {
    // string
    shortName: shortName_example,
  } satisfies GetDataProductByShortNameRequest;

  try {
    const data = await api.getDataProductByShortName(body);
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
| **shortName** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DataProductDTO**](DataProductDTO.md)

### Authorization

[keycloak-token](../README.md#keycloak-token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Get the Data Product by its short name. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDataProducts

> Array&lt;DataProductDTO&gt; listDataProducts(productType)



### Example

```ts
import {
  Configuration,
  DataProductsApi,
} from '';
import type { ListDataProductsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: keycloak-token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DataProductsApi(config);

  const body = {
    // DataProductType (optional)
    productType: ...,
  } satisfies ListDataProductsRequest;

  try {
    const data = await api.listDataProducts(body);
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
| **productType** | `DataProductType` |  | [Optional] [Defaults to `undefined`] [Enum: OTHER_DATA_PRODUCT, STATISTIC_PRODUCT] |

### Return type

[**Array&lt;DataProductDTO&gt;**](DataProductDTO.md)

### Authorization

[keycloak-token](../README.md#keycloak-token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List Data Products. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

