
# TaskRegistration

Register a command for a task. \\[jobId\\] is opaque to us: we only ever compare it for equality against the job id supplied with subsequent data file writes.

## Properties

Name | Type
------------ | -------------
`command` | [TaskCommand](TaskCommand.md)
`job_id` | string

## Example

```typescript
import type { TaskRegistration } from ''

// TODO: Update the object below with actual values
const example = {
  "command": null,
  "job_id": null,
} satisfies TaskRegistration

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TaskRegistration
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


