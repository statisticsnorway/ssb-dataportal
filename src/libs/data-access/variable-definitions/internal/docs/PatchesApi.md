# PatchesApi

All URIs are relative to *https://metadata.intern.ssb.no*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPatch**](PatchesApi.md#createpatch) | **POST** /variable-definitions/{variable-definition-id}/patches | Create a new patch for a variable definition. |
| [**getPatch**](PatchesApi.md#getpatch) | **GET** /variable-definitions/{variable-definition-id}/patches/{patch-id} | Get one concrete patch for the given variable definition. |
| [**listPatches**](PatchesApi.md#listpatches) | **GET** /variable-definitions/{variable-definition-id}/patches | List all patches for the given variable definition. |



## createPatch

> CompleteView createPatch(variableDefinitionId, validFrom, createPatch)

Create a new patch for a variable definition.

Create a new patch for a variable definition.

### Example

```ts
import {
  Configuration,
  PatchesApi,
} from '';
import type { CreatePatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: labid_token
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: keycloak_token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PatchesApi(config);

  const body = {
    // string | Unique identifier for the variable definition.
    variableDefinitionId: wypvb3wd,
    // Date | Valid from date for the specific validity period to be patched. (optional)
    validFrom: 1970-01-01,
    // CreatePatch (optional)
    createPatch: {"name":{"en":"Country Background","nb":"Landbakgrunnen","nn":"Landbakgrunnen"},"definition":{"en":"Country background is the person's own, the mother's or possibly the father's country of birth. Persons without an immigrant background always have Norway as country background. In cases where the parents have different countries of birth the mother's country of birth is chosen. If neither the person nor the parents are born abroad, country background is chosen from the first person born abroad in the order mother's mother, mother's father, father's mother, father's father.","nb":"For personer født i utlandet, er dette (med noen få unntak) eget fødeland. For personer født i Norge er det foreldrenes fødeland. I de tilfeller der foreldrene har ulikt fødeland, er det morens fødeland som blir valgt. Hvis ikke personen selv eller noen av foreldrene er utenlandsfødt, hentes landbakgrunn fra de første utenlandsfødte en treffer på i rekkefølgen mormor, morfar, farmor eller farfar.","nn":"For personar fødd i utlandet, er dette (med nokre få unntak) eige fødeland. For personar fødd i Noreg er det fødelandet til foreldra. I dei tilfella der foreldra har ulikt fødeland, er det fødelandet til mora som blir valt. Viss ikkje personen sjølv eller nokon av foreldra er utenlandsfødt, blir henta landsbakgrunn frå dei første utenlandsfødte ein treffar på i rekkjefølgja mormor, morfar, farmor eller farfar."},"classification_reference":"91","unit_types":["01","05"],"subject_fields":["he04"],"contains_special_categories_of_personal_data":false,"measurement_type":"01","valid_until":"2026-01-01","external_reference_uri":"https://www.ssb.no/a/metadata/conceptvariable/vardok/1919/nb","comment":{"en":"Changes in unit types","nb":"Endring i enhetstyper.","nn":"Endring i enhetstyper."},"related_variable_definition_uris":["https://example.com/"],"contact":{"title":{"en":"Division for population statistics","nb":"Seksjon for befolkningsstatistikk","nn":"Seksjon for befolkningsstatistikk"},"email":"s320@ssb.no"}},
  } satisfies CreatePatchRequest;

  try {
    const data = await api.createPatch(body);
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
| **validFrom** | `Date` | Valid from date for the specific validity period to be patched. | [Optional] [Defaults to `undefined`] |
| **createPatch** | [CreatePatch](CreatePatch.md) |  | [Optional] |

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


## getPatch

> CompleteView getPatch(variableDefinitionId, patchId)

Get one concrete patch for the given variable definition.

Get one concrete patch for the given variable definition. The full object is returned for comparison purposes.

### Example

```ts
import {
  Configuration,
  PatchesApi,
} from '';
import type { GetPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PatchesApi();

  const body = {
    // string | Unique identifier for the variable definition.
    variableDefinitionId: wypvb3wd,
    // number | ID of the patch to retrieve
    patchId: 1,
  } satisfies GetPatchRequest;

  try {
    const data = await api.getPatch(body);
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
| **patchId** | `number` | ID of the patch to retrieve | [Defaults to `undefined`] |

### Return type

[**CompleteView**](CompleteView.md)

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


## listPatches

> Array&lt;CompleteView&gt; listPatches(variableDefinitionId)

List all patches for the given variable definition.

List all patches for the given variable definition. The full object is returned for comparison purposes.

### Example

```ts
import {
  Configuration,
  PatchesApi,
} from '';
import type { ListPatchesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PatchesApi();

  const body = {
    // string | Unique identifier for the variable definition.
    variableDefinitionId: wypvb3wd,
  } satisfies ListPatchesRequest;

  try {
    const data = await api.listPatches(body);
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

