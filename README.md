
## Development

Run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.


## Lint
We use [`biome`](https://biomejs.dev/guides/getting-started/).

Check
```bash
yarn lint
```
Fix
```bash
yarn lint:fix
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