This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Folder structure
.
├── app
│  ├── (services)
│  │ ├── (.)classifications
│  │ │ ├── [id]
│  │ │ │ ├── page
│  │ ├── (.)variable-definitions
│  │ │ ├── [id]
│  │ │ │ ├── page
│  │ ├── classifications
│  │ │ ├── page
│  │ ├── variable-definitions
│  │ │ ├── page
│  │ ├── Service layout
│  ├── Root layout
│  ├── Home page
├── components
├── hooks
├── lib
├── public
├── tests
├── types
├── utils

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