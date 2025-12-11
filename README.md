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
Unit tests are placed inside the component folders to test and named componentName.spec.tsx
End-to-end tests (called e2e) is placed in folder 'e2e/'

### Jest

Run unit tests

```bash
yarn test
```

remove cache

```bash
yarn jest --clearCache
```

Update snapshots
Start watch session - interactive mode
Enter u to update

```bash
yarn test:watch
u
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

Run codegen

```bash
yarn codegen
```

## Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
