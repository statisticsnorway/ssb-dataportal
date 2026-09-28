# PR: Migrate UI styling to SSB design system + CodeTree virtualization for large classifications

## Summary
This PR completes the migration of UI styling to the SSB design system and introduces **window-scroll-based virtualization** for the code tree, making "open all" fast even for very large classifications (e.g. Næringsgruppering with ~1700+ codes).

## Changes

### 1. CodeTree virtualization for performance (core optimization)

**Problem**: Clicking "open all" on large classifications took 1-2 seconds because every row was rendered as a React component up front, and the inner scroll box was only 512px tall, making the expanded tree look incomplete.

**Solution**: Rewrote `CodeTree` to use **window-scroll-based virtualization** — only a small window of rows mount at any time, while the page itself scrolls naturally like before. Spacer table rows preserve the full document height so the browser's native scrollbar and page-length feel unchanged.

**Files modified**:
- `src/components/code-tree/CodeTreeRow.tsx` — Rewritten as a non-recursive component taking `isExpanded`/`isSelected` booleans (instead of tree-wide `expandedCodes`/`selectedCode` sets). The `propsAreEqual` memo comparator now checks only this row's own primitives + stable callbacks, so unrelated branches skip re-rendering entirely on interactions.
- `src/components/code-tree/index.tsx` — Complete rewrite:
  - `useWindowVirtualizedRows` hook computes which slice of rows falls within the browser viewport using `containerRef.current.getBoundingClientRect().top` + `window.innerHeight`, throttled to one recompute per animation frame
  - Spacer `<tr>` elements above/below the visible window preserve full document height for natural page scrolling
  - Dynamically sizes to available viewport height (no fixed small box)
  - Below VIRTUALIZE_THRESHOLD (150 visible rows), renders everything unchanged — all existing tests for small classifications are fully unaffected
  - `flattenVisibleCodeTree` utility replaces recursive JSX rendering with a plain data structure that the UI layer windowizes
- `src/utils/classifications/flattenVisibleCodeTree.ts` + `.spec.ts` — New depth-first flatten utility (mirrors `buildCodeTree` patterns) that only recurses into children when their parent code is in `expandedCodes`

### 2. SSB design system styling migration (completed in prior session)

- Shared `ClassificationSurface` component (`src/components/classification-surface/`) — unified border/radius/background/color used by code tree, classification table, and correspondence table
- Classification tags use `data-color='magic'` consistently
- Global `--white-color` variable replaces hard-coded `white` across the app
- Code example token colors use explicit `#491FD6` for contrast
- Period/data-coverage graph colors use SSB secondary blue-green palette
- Filter hover colors use `var(--ds-color-surface-hover)`
- ClosableAlert icon alignment and spacing fixes
- Removed redundant table wrappers, fixed border-radius on correspondence table

## Test results
- **29 tests pass** across code-tree unit tests, flatten utility spec, and buildCodeTree spec
- **Lint, format, typecheck all clean** (`pnpm lint:check`, `pnpm format:check`, `pnpm types:check`)

## How to verify the optimization
1. Open a large classification (e.g. klass id 6 "Standard Industrial Classification" SN2007 with ~1700 codes)
2. Click "Expand all"
3. The tree now renders quickly — only ~20-40 rows mount at a time depending on viewport
4. Page scrolls naturally through all rows (spacer rows maintain correct document height)
5. Small classifications (< 150 visible rows) render identically to before — no behavior change

## Checklist
- [x] `pnpm lint:check` passes
- [x] `pnpm format:check` passes
- [x] `pnpm next typegen && pnpm types:check` passes
- [x] `pnpm vitest run "src/components/code-tree/index.spec.tsx"` passes (19 tests)
- [x] `pnpm vitest run "src/utils/classifications/flattenVisibleCodeTree.spec.ts"` + `buildCodeTree.spec.ts` passes (10 tests)
- [x] Dead code (`pnpm lint:dead-code`) green (4 pre-existing unused exports unchanged)
- [ ] Push branch and create PR at https://github.com/statisticsnorway/ssb-dataportal/pull/620 (remote: origin = metadata-catalog-prototype.git)
