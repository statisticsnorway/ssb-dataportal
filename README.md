## Development

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Yarn

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

## Lint and format

We use [`biome`](https://biomejs.dev/guides/getting-started/).

### Lint

```bash
yarn lint:check
```

Fix linting

```bash
yarn lint:fix
```

### Format

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

Run e2e tests

```bash
yarn test:e2e
```
If tests not working after upgrade

```bash
yarn playwright install
```

### Generate client code
Run codegen
```bash
yarn codegen-vardef-public
```

