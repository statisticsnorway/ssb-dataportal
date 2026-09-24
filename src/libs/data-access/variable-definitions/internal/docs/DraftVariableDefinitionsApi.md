# DraftVariableDefinitionsApi

All URIs are relative to *https://metadata.intern.ssb.no*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createVariableDefinition**](DraftVariableDefinitionsApi.md#createvariabledefinition) | **POST** /variable-definitions | Create a variable definition. |
| [**deleteVariableDefinitionById**](DraftVariableDefinitionsApi.md#deletevariabledefinitionbyid) | **DELETE** /variable-definitions/{variable-definition-id} | Delete a variable definition. |
| [**updateVariableDefinitionById**](DraftVariableDefinitionsApi.md#updatevariabledefinitionbyid) | **PATCH** /variable-definitions/{variable-definition-id} | Update a variable definition. |



## createVariableDefinition

> CompleteView createVariableDefinition(createDraft)

Create a variable definition.

Create a variable definition. New variable definitions are automatically assigned status DRAFT and must include all required fields. Attempts to specify id or variable_status in a request will receive 400 BAD REQUEST responses.

### Example

```ts
import {
  Configuration,
  DraftVariableDefinitionsApi,
} from '';
import type { CreateVariableDefinitionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: labid_token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DraftVariableDefinitionsApi(config);

  const body = {
    // CreateDraft (optional)
    createDraft: {"name":{"en":"Country Background","nb":"Landbakgrunn","nn":"Landbakgrunn"},"short_name":"landbak","definition":{"en":"Country background is the person's own, the mother's or possibly the father's country of birth. Persons without an immigrant background always have Norway as country background. In cases where the parents have different countries of birth the mother's country of birth is chosen. If neither the person nor the parents are born abroad, country background is chosen from the first person born abroad in the order mother's mother, mother's father, father's mother, father's father.","nb":"For personer født i utlandet, er dette (med noen få unntak) eget fødeland. For personer født i Norge er det foreldrenes fødeland. I de tilfeller der foreldrene har ulikt fødeland, er det morens fødeland som blir valgt. Hvis ikke personen selv eller noen av foreldrene er utenlandsfødt, hentes landbakgrunn fra de første utenlandsfødte en treffer på i rekkefølgen mormor, morfar, farmor eller farfar.","nn":"For personar fødd i utlandet, er dette (med nokre få unntak) eige fødeland. For personar fødd i Noreg er det fødelandet til foreldra. I dei tilfella der foreldra har ulikt fødeland, er det fødelandet til mora som blir valt. Viss ikkje personen sjølv eller nokon av foreldra er utenlandsfødt, blir henta landsbakgrunn frå dei første utenlandsfødte ein treffar på i rekkjefølgja mormor, morfar, farmor eller farfar."},"classification_reference":"91","unit_types":["01","02"],"subject_fields":["he04"],"contains_special_categories_of_personal_data":true,"measurement_type":"01","valid_from":"2003-01-01","external_reference_uri":"https://www.ssb.no/a/metadata/conceptvariable/vardok/1919/nb","comment":{"nb":"Fra og med 1.1.2003 ble definisjon endret til også å trekke inn besteforeldrenes fødeland.","nn":"Fra og med 1.1.2003 ble definisjon endret til også å trekke inn besteforeldrenes fødeland.","en":"As of 1 January 2003, the definition was changed to also include the grandparents' country of birth."},"related_variable_definition_uris":["https://example.com/"],"contact":{"title":{"en":"Division for population statistics","nb":"Seksjon for befolkningsstatistikk","nn":"Seksjon for befolkningsstatistikk"},"email":"s320@ssb.no"}},
  } satisfies CreateVariableDefinitionRequest;

  try {
    const data = await api.createVariableDefinition(body);
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
| **createDraft** | [CreateDraft](CreateDraft.md) |  | [Optional] |

### Return type

[**CompleteView**](CompleteView.md)

### Authorization

[labid_token](../README.md#labid_token)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successfully created. |  -  |
| **400** | Bad request. |  -  |
| **409** | Short name is already in use by another variable definition. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteVariableDefinitionById

> deleteVariableDefinitionById(variableDefinitionId)

Delete a variable definition.

Delete a variable definition.

### Example

```ts
import {
  Configuration,
  DraftVariableDefinitionsApi,
} from '';
import type { DeleteVariableDefinitionByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: labid_token
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: keycloak_token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DraftVariableDefinitionsApi(config);

  const body = {
    // string | Unique identifier for the variable definition.
    variableDefinitionId: wypvb3wd,
  } satisfies DeleteVariableDefinitionByIdRequest;

  try {
    const data = await api.deleteVariableDefinitionById(body);
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

`void` (Empty response body)

### Authorization

[labid_token](../README.md#labid_token), [keycloak_token](../README.md#keycloak_token)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successfully deleted |  -  |
| **404** | Not found |  -  |
| **405** | Not allowed for variable definitions with this status. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateVariableDefinitionById

> CompleteView updateVariableDefinitionById(variableDefinitionId, updateDraft)

Update a variable definition.

Update a variable definition. Only the fields which need updating should be supplied. Fields supplied with explicit null values will be deleted unless the field is required.

### Example

```ts
import {
  Configuration,
  DraftVariableDefinitionsApi,
} from '';
import type { UpdateVariableDefinitionByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: labid_token
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: keycloak_token
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DraftVariableDefinitionsApi(config);

  const body = {
    // string | Unique identifier for the variable definition.
    variableDefinitionId: wypvb3wd,
    // UpdateDraft (optional)
    updateDraft: {"classification_reference":702},
  } satisfies UpdateVariableDefinitionByIdRequest;

  try {
    const data = await api.updateVariableDefinitionById(body);
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
| **updateDraft** | [UpdateDraft](UpdateDraft.md) |  | [Optional] |

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
| **200** | Successfully updated |  -  |
| **400** | Bad request. |  -  |
| **404** | Not found |  -  |
| **405** | Not allowed for variable definitions with this status. |  -  |
| **409** | Short name is already in use by another variable definition. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

