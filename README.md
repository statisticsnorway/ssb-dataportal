# SSB Dataportal

> _What we know about our data when everyone goes home for the night_

A frontend for discovery and display of Statistics Norway's metadata. Once complete this app will provide internal and public visibility for the following categories of metadata:

- Data products
- Variable instances
- Variable definitions
- Classifications and code lists

It's currently in the prototype stage, with a goal of displaying Variable definitions to internal users.

## Development

### Environment

1. Install Node: <https://nodejs.org/en/download>
1. Install pnpm: <https://pnpm.io/installation>
1. Install dev dependencies: `pnpm install`
1. Install pre-commit: `uv tool install pre-commit`
1. Install pre-commit hooks: `pre-commit install`

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Package manager

Pnpm is our package manager. This must be installed with a system-wide manual installation. Installation instructions and documentation are available here: <https://pnpm.io/installation>

#### Update package manager

`pnpm self-update`

#### Update dependencies

To reduce the risk of installing compromised packages cooldown period of 7 days is set in `pnpm-workspace.yaml`

Run
```bash
pnpm outdated
```
Update versions in `package.json`

### Vulnerability scanning

We use `grype` for vulnerability scanning.
The result will show a risk score based on: threat, impact and context.

Read more https://oss.anchore.com/docs/guides/vulnerability/interpreting-results/#why-risk-based-sorting-works-best

For now handling reported vulnerabilities must be handled manually.

#### Local scans

Install [Grype](https://oss.anchore.com/docs/installation/grype/)

Scan filesystem
```bash
grype .
```

Scan docker image

```bash
docker build --no-cache -t ssb-dataportal:latest .

grype ssb-dataportal
```

### Lint and format

We use [`biome`](https://biomejs.dev/guides/getting-started/).

#### Lint

```bash
pnpm lint:check
```

Fix linting

```bash
pnpm lint:fix
```

#### Format

```bash
pnpm format:check
```

Fix linting

```bash
pnpm format:fix
```

### Config

Configuration is primarily source from `.env*` files. This may be overridden in deployed instances with environment variables.

| File         | Tracked            |                                                                |
| ------------ | ------------------ | -------------------------------------------------------------- |
| `.env`       | :white_check_mark: | Base config to apply when not overridden                       |
| `.env.test`  | :white_check_mark: | Applies when running tests                                     |
| `.env.local` | :x:                | Local-only config which must not be tracked in version control |

#### Commonly used config

| Key                              | Description                                                                                                  |
|----------------------------------|--------------------------------------------------------------------------------------------------------------|
| `METADATA_API_BASE_PATH`         | Which Metadata API instance to point to. Can be set to `http://localhost:8081` to work with a local instance |
| `DATADOC_USE_STATIC_DATA`        | `true` to use the static data product and dataset data from the repo. Otherwise the data will be retrieved from a live instance. |
| `VARDEF_USE_STATIC_DATA`         | `true` to use the static data from the repo. Otherwise the data will be retrieved from a live instance.      |
| `KLASS_BASE_PATH`                | Which Klass instance to point to. Can be set to `http://localhost:8080` to work with a local instance        |
| `KLASS_USE_STATIC_DATA`          | `true` to use the static data from the repo. Otherwise the data will be retrieved from a live instance.      |
| `SSB_DATAPORTAL_JWT_TOKEN`       | A JWT token to use for auth. Can be obtained from via the [Dapla CLI](#local-auth).                          |
| `DANGEROUSLY_DISABLE_USER_AUTH`  | `true` to completely disable token verification and take full control over authentication                    |
| `IS_AUTHENTICATED`               | `true` to hardcode successful authentication. Only applies under `DANGEROUSLY_DISABLE_USER_AUTH` mode        |
| `DEV_ENVIRONMENT_NAME`           | Used to identify different dev and test instances. May for example be set to the branch name.                |
| `DAPLA_LAB_VARDEF_URL`           | URL to Vardef instance used in Dapla Lab integration.                                                        |
| `NEXT_PUBLIC_LOGIN_URL`          | URL to login page - value accessible in the browser.                                                         |
| `NEXT_PUBLIC_LOGOUT_URL`         | URL to logout page - value accessible in the browser.                                                        |
| `NEXT_PUBLIC_ENABLE_TEST_ROUTES` | `true` to enable local test-specific routes.                                                                 |
| `VARDEF_API_DOCS_URL`            | URL to the Swagger API docs for variable definitions.                                                        |
 | `SITE_URL`                      | The base URL of the deployed site. Can be set to `http://localhost:3000` for local testing or development.          |

### Local auth

1. Install Dapla CLI: <https://github.com/statisticsnorway/dapla-cli?tab=readme-ov-file#installation>
1. Log in: `dp auth login --client metadata-local --env test`
1. Copy your access token: `dp auth show-access-token --to-clipboard --client metadata-local --env test`
1. Save it in the `SSB_DATAPORTAL_JWT_TOKEN` environment variable.

## Test

We use `vitest` for unit testing and `playwright` for end-to-end tests.
Unit tests are placed inside the component folder.
End-to-end tests (called e2e) is placed in folder 'e2e/'.
Name testfiles: `<componentName>.spec.tsx`

### Vitest

Guide Vitest: [https://vitest.dev/guide/](https://vitest.dev/guide/)

Run unit tests

```bash
pnpm test
```

Start watch session - interactive mode

```bash
pnpm test:watch
```

Update snapshots

```bash
pnpm test:update-snapshots
```

### Playwright

Install the Playwright Test for VSCode extension to run and debug tests directly from VS Code.

If tests not working

```bash
pnpm playwright install
```

#### Configure Environment for Tests

Config can be added in `.env.test`. This file is included in the repo so _no secrets_! All tests should run with static data by default.

#### Running Tests

```bash
pnpm test:e2e
```

#### Using Real API Data

To run tests with live data fetched from a remote API edit playwright.config.ts:

```
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
```

Run your tests as usual, and they will fetch real data instead of using static fixtures.

#### Run e2e tests in UI mode

```bash
pnpm test:e2e:ui
```

#### Run e2e tests with visible browser

```bash
pnpm test:e2e:headed
```

#### Generate tests

```bash
pnpm test:e2e:generate
```

### Accessibility

#### Lighthouse

Run accessibility checks directly from browser dev tools.

Note: These checks are lightweight and provide a quick overview.

#### Wave

Wave is a web accessibility evaluation tool.

- For external websites, use the online tool: https://wave.webaim.org/
- For internal applications, download the [Wave browser extension](https://wave.webaim.org/extension/)

#### Playwright/axe

SSB Dataportal uses Playwright with axe for accessibility testing.

##### Guidelines:

- When creating a new test file, include **accessibility** in the file name.
- You can test specific rules using:

```TypeScript
 .withRules(['color-contrast'])
```

- Full list of Axe HTML rules: https://dequeuniversity.com/rules/axe/4.1

##### Run only accessibility tests:

```bash
pnpm test:e2e:accessibility
```

### URL state

The variable definitions search page stores search, filter, sort, and pagination state in the URL query parameters.

This makes it possible to share links, refresh the page, and restore the same view from a URL.

#### Query parameters

| Parameter | Description | Example |
|---|---|---|
| `q` | Text filter for variable name / short name | `?q=inntekt` |
| `subjects` | Selected statistical subject codes | `?subjects=al` |
| `status` | Selected publication statuses | `?status=DRAFT` |
| `sort` | Selected sort option | `?sort=titleDesc` |
| `page` | Current pagination page | `?page=2` |

Example:

```txt
/variable-definitions?q=inntekt&subjects=al&status=DRAFT&sort=titleDesc&page=2
```

### Generate client code

This project uses OpenAPI Generator to generate TypeScript clients from OpenAPI specs.

You can generate the clients one at a time using the scripts defined in package.json.

#### Generate Vardef internal

```bash
pnpm codegen:vardef-internal
```

Uses the OpenAPI spec from: <https://metadata.ssb.no/docs/openapi/variable-definitions/variable-definitions-internal.yml>

Output directory: src/libs/data-access/variable-definitions/internal

#### Generate Klass

```bash
pnpm codegen:klass
```

Uses the OpenAPI spec from: <https://data.ssb.no/api/klass/v3/api-docs>

Output directory: src/libs/data-access/klass

#### Generate Datadoc internal

```bash
pnpm codegen:datadoc
```

Uses the OpenAPI spec from: <https://metadata.intern.test.ssb.no/docs/openapi/datadoc/internal-datadoc-api-0.1.yml>

Output directory: src/libs/data-access/datadoc/internal

## Release process

Update the version using `pnpm version <version bump type>`. This project follows [semantic versioning](https://semver.org/):

```bash
pnpm version patch   # bug fixes
pnpm version minor   # new features
pnpm version major   # breaking changes
```

Create a new branch for the release.

Commit with message like `Bump version x.x.x -> y.y.y`.

Open and merge a PR.

## Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
