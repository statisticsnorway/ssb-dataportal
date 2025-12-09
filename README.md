# Metadata catalog

> *What we know about our data when everyone goes home for the night*

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

### Test

We use `jest` for unit testing and `playwright` for end-to-end tests.
Unit tests are placed inside the component folders to test and named componentName.spec.tsx
End-to-end tests (called e2e) is placed in folder 'e2e/'

#### Jest

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

#### Playwright

Install VS code extension: Playwright Test for VSCode

Run e2e tests

```bash
yarn test:e2e
```

Run e2e tests 'headed' - visible browser

```bash
yarn test:e2e:headed
```

If tests not working after upgrade

```bash
yarn playwright install
```

Generate tests

```bash
yarn dev

npx playwright codegen http://localhost:3000
```

#### Generate client code
Run codegen
```bash
yarn codegen
```

## Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
