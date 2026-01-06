# Metadata catalog

> _What we know about our data when everyone goes home for the night_

A frontend for discovery and display of Statistics Norway's metadata. Once complete this app will provide internal and public visibility for the following categories of metadata:

- Datasets
- Variable instances
- Variable definitions
- Classifications and code lists

It's currently in the prototype stage, with a goal of displaying Variable definitions to internal users.

## Development

### Environment

1. Install Node: <https://nodejs.org/en/download>
1. Install dev dependencies: `yarn install`
1. Install pre-commit: `pipx install pre-commit`
1. Install pre-commit hooks: `pre-commit install`

### Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Yarn

Yarn is our package manager.
We use [corepack](https://yarnpkg.com/corepack) for locking project version.

```bash
corepack enable
```

Update Yarn version

```bash
yarn set version stable
yarn install
```

### Lint and format

We use [`biome`](https://biomejs.dev/guides/getting-started/).

#### Lint

```bash
yarn lint:check
```

Fix linting

```bash
yarn lint:fix
```

#### Format

```bash
yarn format:check
```

Fix linting

```bash
yarn format:fix
```

## Test

We use `jest` for unit testing and `playwright` for end-to-end tests.
Unit tests are placed inside the component folder.
End-to-end tests (called e2e) is placed in folder 'e2e/'.
Name testfiles: `<componentName>.spec.tsx`

### Jest

Run unit tests

```bash
yarn test
```

Remove cache

```bash
yarn jest --clearCache
```

Start watch session - interactive mode

```bash
yarn test:watch
```

Update snapshots

```bash
yarn test:update-snapshots
```

### Playwright

Install the Playwright Test for VSCode extension to run and debug tests directly from VS Code.

If tests not working

```bash
yarn playwright install
```

#### Configure Environment for Tests

Create a `.env.test` file in the root of your project:

`NEXT_TEST=test`

All end-to-end (E2E) tests will run with static data by default.

#### Running Tests

```bash
yarn test:e2e
```

#### Using Real API Data

To run tests with live data fetched from a remote API edit playwright.config.ts:

```
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
```

Run your tests as usual, and they will fetch real data instead of using static fixtures.

#### Run e2e tests with visible browser

```bash
yarn test:e2e:headed
```

#### Generate tests

```bash
yarn dev

npx playwright codegen http://localhost:3000
```

### Generate client code

This project uses OpenAPI Generator to generate TypeScript clients from OpenAPI specs.

You can generate the clients one at a time using the yarn scripts defined in package.json.

Generate Vardef internal:

```bash
yarn codegen:vardef-internal
```

Uses the OpenAPI spec from:
https://metadata.ssb.no/docs/openapi/variable-definitions/variable-definitions-internal.yml

Output directory: src/libs/data-access/variable-definitions/internal

Generate Klass:

```bash
yarn codegen:klass
```

Uses the OpenAPI spec from:
https://data.ssb.no/api/klass/v3/api-docs

Output directory: src/libs/data-access/klass

## Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
