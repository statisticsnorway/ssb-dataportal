# TaskRegistrationApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**registerTask**](TaskRegistrationApi.md#registertask) | **POST** /tasks/{task-id} |  |



## registerTask

> registerTask(taskId, taskRegistration)



### Example

```ts
import {
  Configuration,
  TaskRegistrationApi,
} from '';
import type { RegisterTaskRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: metamapper-datadoc-m2m
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TaskRegistrationApi(config);

  const body = {
    // string
    taskId: taskId_example,
    // TaskRegistration
    taskRegistration: {"command":"start","job_id":"01JD8XQ2"},
  } satisfies RegisterTaskRequest;

  try {
    const data = await api.registerTask(body);
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
| **taskId** | `string` |  | [Defaults to `undefined`] |
| **taskRegistration** | [TaskRegistration](TaskRegistration.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[metamapper-datadoc-m2m](../README.md#metamapper-datadoc-m2m)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The command was applied. A start makes the job the only one permitted to write data files for the task, replacing any previously active job. A complete deletes the data files the task had claimed but this job did not report, along with any dataset and data product left empty. Repeating either call with the same job id has no further effect. |  -  |
| **400** | Bad request. |  -  |
| **409** | The supplied job is no longer the active task for the bucket. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

