# VariableDefinitionsApi

All URIs are relative to *https://metadata.intern.ssb.no*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getVariableDefinitionById**](VariableDefinitionsApi.md#getvariabledefinitionbyid) | **GET** /variable-definitions/{variable-definition-id} | Get one variable definition. |
| [**listVariableDefinitions**](VariableDefinitionsApi.md#listvariabledefinitions) | **GET** /variable-definitions | List all variable definitions. |



## getVariableDefinitionById

> ListVariableDefinitions200ResponseInner getVariableDefinitionById(variableDefinitionId, acceptLanguage, dateOfValidity, render)

Get one variable definition.

Get one variable definition.

### Example

```ts
import {
  Configuration,
  VariableDefinitionsApi,
} from '';
import type { GetVariableDefinitionByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: labid_token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VariableDefinitionsApi(config);

  const body = {
    // string | Unique identifier for the variable definition.
    variableDefinitionId: wypvb3wd,
    // SupportedLanguages | Render the variable definition in the given language. (optional)
    acceptLanguage: nb,
    // Date | List only variable definitions which are valid on this date. (optional)
    dateOfValidity: 1970-01-01,
    // boolean | Render the Variable Definition for presentation in a frontend (optional)
    render: false,
  } satisfies GetVariableDefinitionByIdRequest;

  try {
    const data = await api.getVariableDefinitionById(body);
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
| **variableDefinitionId** | `string` | Unique identifier for the variable definition. | [Defaults to `undefined`] |
| **acceptLanguage** | `SupportedLanguages` | Render the variable definition in the given language. | [Optional] [Defaults to `undefined`] [Enum: nb, nn, en] |
| **dateOfValidity** | `Date` | List only variable definitions which are valid on this date. | [Optional] [Defaults to `undefined`] |
| **render** | `boolean` | Render the Variable Definition for presentation in a frontend | [Optional] [Defaults to `undefined`] |

### Return type

[**ListVariableDefinitions200ResponseInner**](ListVariableDefinitions200ResponseInner.md)

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listVariableDefinitions

> Array&lt;ListVariableDefinitions200ResponseInner&gt; listVariableDefinitions(acceptLanguage, dateOfValidity, shortName, render)

List all variable definitions.

List all variable definitions.

### Example

```ts
import {
  Configuration,
  VariableDefinitionsApi,
} from '';
import type { ListVariableDefinitionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: labid_token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VariableDefinitionsApi(config);

  const body = {
    // SupportedLanguages | Render the variable definition in the given language. (optional)
    acceptLanguage: nb,
    // Date | List only variable definitions which are valid on this date. (optional)
    dateOfValidity: 1970-01-01,
    // string | List only the variable definition with the given short name. (optional)
    shortName: landbak,
    // boolean | Render the Variable Definition for presentation in a frontend (optional)
    render: false,
  } satisfies ListVariableDefinitionsRequest;

  try {
    const data = await api.listVariableDefinitions(body);
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
| **acceptLanguage** | `SupportedLanguages` | Render the variable definition in the given language. | [Optional] [Defaults to `undefined`] [Enum: nb, nn, en] |
| **dateOfValidity** | `Date` | List only variable definitions which are valid on this date. | [Optional] [Defaults to `undefined`] |
| **shortName** | `string` | List only the variable definition with the given short name. | [Optional] [Defaults to `undefined`] |
| **render** | `boolean` | Render the Variable Definition for presentation in a frontend | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;ListVariableDefinitions200ResponseInner&gt;**](ListVariableDefinitions200ResponseInner.md)

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

