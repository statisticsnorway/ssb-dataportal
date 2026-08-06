# AGENTS.md

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript frontend for Statistics Norway's metadata (variable definitions, classifications, datadoc). Strict mode with `noUncheckedIndexedAccess`; path alias `@/*` -> `src/*`.

## Commands

```bash
pnpm dev                  # dev server on :3000 (uses .env)
pnpm dev:test             # NODE_ENV=test dev server (loads .env.test, static data)
pnpm lint:check / lint:fix    # biome check
pnpm format:check / format:fix
pnpm lint:dead-code       # fallow dead-code
pnpm next typegen         # required BEFORE tsc (generates .next/types)
pnpm types:check          # tsc --noEmit
pnpm test                 # vitest; coverage is ALWAYS on (writes ./coverage)
pnpm test:watch
pnpm test:e2e             # playwright; boots TWO servers (:3000 auth, :8000 unauth)
pnpm test:e2e:accessibility / :headed / :ui / :generate
```

## Environment & static data

- `.env` (tracked, base), `.env.test` (tracked, applies when `NODE_ENV=test`), `.env.local` (untracked). Next.js load order applies.
- Every data source has a toggle: `VARDEF_USE_STATIC_DATA`, `DATADOC_USE_STATIC_DATA`, `KLASS_USE_STATIC_DATA`, `KLASS_SEARCH_USE_STATIC_DATA`, `KLASS_SUBSCRIBER_USE_STATIC_DATA`. `.env` defaults these to `false` (live APIs); `.env.test` sets them `true`. All e2e/CI run on static data.
- Static fixtures live in `src/static-data/*.json`, served through `src/utils/mock-data.ts`. Codes are only mocked for klass id `2003`.
- `DANGEROUSLY_DISABLE_USER_AUTH=true` + `IS_AUTHENTICATED=true` skips auth in test mode; the unauth e2e server runs `IS_AUTHENTICATED=false`.
- `HIDE_CLASSIFICATIONS=true` in `.env` but `false` in `.env.test` — tests expect classifications visible.

## Architecture

- Server-only data access in `src/libs/data/*` wraps the generated OpenAPI clients and switches between static mock data and live APIs via the env toggles. Server modules must stay `'use server'`.
- Generated clients (`typescript-fetch`) live in `src/libs/data-access/{variable-definitions,klass,datadoc}/*`. Generated in `datadoc/` too. Do NOT hand-edit; regenerate via `pnpm codegen:vardef-internal`, `pnpm codegen:klass`, `pnpm codegen:datadoc` (specs in `openapitools.json`).
- `src/libs/data-access/**` is excluded from lint, format, pre-commit, and coverage — don't fight that.
- Auth: JWT from request headers via jose (`src/libs/auth/`), falling back to `SSB_DATAPORTAL_JWT_TOKEN` env or M2M (`VARDEF_USE_M2M_TOKEN`). Keycloak login/logout via `NEXT_PUBLIC_LOGIN_URL`/`NEXT_PUBLIC_LOGOUT_URL`.
- Logging with pino: `src/libs/logger/` — use `createLoggerWithBindings`, never `console` (biome `noConsole` errors).
- Variable-definitions search page persists `q`, `subjects`, `status`, `sort`, `page` in URL query params (nuqs).
- Styling: shared CSS vars/utilities in `src/app/global.css`; component styles in co-located `*.module.css`; typography via SSB classes `primaryHeading` / `secondaryHeading`.
- SVG imports compile through `@svgr/webpack` (configured in `next.config.ts`).

## Tests

- Unit tests: co-located next to the component, named `<componentName>.spec.tsx` (vitest + Testing Library + jsdom).
- E2E: `e2e/*.spec.ts` (Playwright, `data-testid` attribute, locale `nb-NO`). Fixtures in `e2e/fixtures/`, helpers in `e2e/utils/`.
- Accessibility e2e tests MUST include `accessibility` in the filename and use axe `.withRules([...])` (see README).
- E2E `webServer` always sets `reuseExistingServer: false` and starts both an authenticated (:3000) and unauthenticated (:8000) server. To test against live APIs, change the webserver command in `playwright.config.ts` to `pnpm dev` — don't commit that.
- CI shards e2e across 4 workers; `test-results/`, `playwright-report/`, `results/`, `coverage/` are regenerated artifacts.

## Conventions & gotchas

- Biome is customized (linter `preset: none`): unused imports/`noExplicitAny`/`noConsole` are errors; `noUnusedVariables` error. Single quotes, semicolons, trailing commas, line width 120. Import organizing is enabled.
- pnpm only (devEngines 11.9.0). `pnpm-workspace.yaml` enforces `minimumReleaseAge: 10080` (7 days) on new deps and an `allowBuilds` whitelist — new dependencies with install scripts must be added there.
- Pre-commit (biome format+lint) is installed via `uv tool install pre-commit`; it excludes snapshots and `src/libs/data-access/`.
- CI runs: lint -> format -> dead-code -> `next typegen` + `tsc` -> prod build -> vitest coverage -> sharded playwright -> SonarQube. Verify all before pushing.
- Releases: `pnpm version patch|minor|major`, commit `Bump version x.x.x -> y.y.y`, merge PR to main. Docker build uses `output: 'standalone'` + distroless runner.
