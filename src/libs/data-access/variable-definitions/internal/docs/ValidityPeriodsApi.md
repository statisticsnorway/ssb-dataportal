# ValidityPeriodsApi

All URIs are relative to *https://metadata.intern.ssb.no*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createValidityPeriod**](ValidityPeriodsApi.md#createvalidityperiod) | **POST** /variable-definitions/{variable-definition-id}/validity-periods | Create a new validity period for a variable definition. |
| [**listValidityPeriods**](ValidityPeriodsApi.md#listvalidityperiods) | **GET** /variable-definitions/{variable-definition-id}/validity-periods | List all validity periods. |



## createValidityPeriod

> CompleteView createValidityPeriod(variableDefinitionId, createValidityPeriod)

Create a new validity period for a variable definition.

Create a new validity period for a variable definition.

### Example

```ts
import {
  Configuration,
  ValidityPeriodsApi,
} from '';
import type { CreateValidityPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: labid_token
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: keycloak_token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ValidityPeriodsApi(config);

  const body = {
    // string | Unique identifier for the variable definition.
    variableDefinitionId: wypvb3wd,
    // CreateValidityPeriod (optional)
    createValidityPeriod: {"name":{"en":"Country Background","nb":"Landbakgrunnen","nn":"Landbakgrunnen"},"definition":{"en":"Country background is the mothers birth country.","nb":"For personer født i utlandet er dette mors fødeland.","nn":"For personar fødd i utlandet mors fødeland."},"classification_reference":"91","unit_types":["01","05"],"subject_fields":["he04"],"contains_special_categories_of_personal_data":false,"measurement_type":"01","valid_from":"2026-01-02","external_reference_uri":"https://www.ssb.no/a/metadata/conceptvariable/vardok/1919/nb","comment":{"en":"Change in legislation triggers change of definition text.","nb":"Endring i lovgiving utløser endring av definisjonstekst.","nn":"Endring i lovgiving utløser endring av definisjonstekst."},"related_variable_definition_uris":["https://example.com/"],"contact":{"title":{"en":"Division for population statistics","nb":"Seksjon for befolkningsstatistikk","nn":"Seksjon for befolkningsstatistikk"},"email":"s320@ssb.no"}},
  } satisfies CreateValidityPeriodRequest;

  try {
    const data = await api.createValidityPeriod(body);
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
| **createValidityPeriod** | [CreateValidityPeriod](CreateValidityPeriod.md) |  | [Optional] |

### Return type

[**CompleteView**](CompleteView.md)

### Authorization

[labid_token](../README.md#labid_token), [keycloak_token](../README.md#keycloak_token)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successfully created. |  -  |
| **404** | Not found |  -  |
| **400** | Bad request. |  -  |
| **405** | Not allowed for variable definitions with this status. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listValidityPeriods

> Array&lt;CompleteView&gt; listValidityPeriods(variableDefinitionId)

List all validity periods.

List all validity periods.

### Example

```ts
import {
  Configuration,
  ValidityPeriodsApi,
} from '';
import type { ListValidityPeriodsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ValidityPeriodsApi();

  const body = {
    // string | Unique identifier for the variable definition.
    variableDefinitionId: wypvb3wd,
  } satisfies ListValidityPeriodsRequest;

  try {
    const data = await api.listValidityPeriods(body);
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

### Return type

[**Array&lt;CompleteView&gt;**](CompleteView.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

