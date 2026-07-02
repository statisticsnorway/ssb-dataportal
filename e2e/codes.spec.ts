import { localization } from '@/libs/language';
import { expect, test, CODES_VERSION_URL } from './fixtures/codesPage.fixture';

// ── Selectors derived from the aria-labels set in CodeTreeRow ──────────────────
//
// Chevron buttons:  aria-label="Vis underkoder for {name}"  (collapsed)
//                   aria-label="Skjul underkoder for {name}" (expanded)
// Row-body buttons: aria-label="Velg kode {code}: {name}"
//                   aria-pressed="true" when selected
//
// Mock hierarchy (codes-mock.json, classification 2003):
//   A  Jordbruk, skogbruk og fiske        ← has children → chevron present
//     01  Jordbruk og tjenester …         ← has children → chevron present
//       011 Dyrking av ettårige vekster   ← leaf
//     02  Skogbruk og tjenester …         ← leaf
//   B  Bergverksdrift og utvinning        ← leaf
//   C  Industri                           ← leaf

const codeA = { code: 'A', name: 'Jordbruk, skogbruk og fiske' };
const code01 = { code: '01', name: 'Jordbruk og tjenester tilknyttet jordbruk' };
const code02 = { code: '02', name: 'Skogbruk og tjenester tilknyttet skogbruk' };
const code011 = { code: '011', name: 'Dyrking av ettårige vekster' };

// Helper: the row-body button for a given code
const rowBodyLabel = (code: string, name: string) => `${localization.codeTree.selectCode} ${code}: ${name}`;

// Helper: chevron button label for collapsed state
const expandLabel = (name: string) => `${localization.codeTree.expand} ${name}`;
const collapseLabel = (name: string) => `${localization.codeTree.collapse} ${name}`;

// ── /classifications/2003/codes ────────────────────────────────────────────────

test.describe('/classifications/[id]/codes', () => {
  test('renders the code tree inside the Koder tab', async ({ codesPage }) => {
    await expect(codesPage.getByRole('tree', { name: localization.codeTree.label })).toBeVisible();
  });

  test('top-level codes are visible on page load', async ({ codesPage }) => {
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(codeA.code, codeA.name) })).toBeVisible();
    await expect(
      codesPage.getByRole('button', { name: rowBodyLabel('B', 'Bergverksdrift og utvinning') }),
    ).toBeVisible();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel('C', 'Industri') })).toBeVisible();
  });

  test('children of top-level codes are collapsed on page load', async ({ codesPage }) => {
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) })).not.toBeVisible();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code02.code, code02.name) })).not.toBeVisible();
  });

  test('top-level code A has an expanded chevron on page load', async ({ codesPage }) => {
    const chevron = codesPage.getByRole('button', { name: collapseLabel(codeA.name) });
    await expect(chevron).toBeVisible();
    await expect(chevron).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking chevron collapses code A and hides its children', async ({ codesPage }) => {
    const chevron = codesPage.getByRole('button', { name: collapseLabel(codeA.name) });
    await chevron.click();

    // chevron now shows the "expand" label and aria-expanded=false
    const expandedChevron = codesPage.getByRole('button', { name: expandLabel(codeA.name) });
    await expect(expandedChevron).toBeVisible();
    await expect(expandedChevron).toHaveAttribute('aria-expanded', 'false');

    // children no longer visible
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) })).not.toBeVisible();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code02.code, code02.name) })).not.toBeVisible();
  });

  test('clicking chevron again re-expands code A', async ({ codesPage }) => {
    // collapse first
    await codesPage.getByRole('button', { name: collapseLabel(codeA.name) }).click();
    // then expand
    await codesPage.getByRole('button', { name: expandLabel(codeA.name) }).click();

    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) })).toBeVisible();
  });

  test('clicking a row body selects the code (aria-pressed becomes true)', async ({ codesPage }) => {
    const rowBody = codesPage.getByRole('button', { name: rowBodyLabel(codeA.code, codeA.name) });

    // not selected initially
    await expect(rowBody).toHaveAttribute('aria-pressed', 'false');

    await rowBody.click();

    await expect(rowBody).toHaveAttribute('aria-pressed', 'true');
  });

  test('clicking chevron does not change the selected code', async ({ codesPage }) => {
    // Select code A first
    const rowBody = codesPage.getByRole('button', { name: rowBodyLabel(codeA.code, codeA.name) });
    await rowBody.click();
    await expect(rowBody).toHaveAttribute('aria-pressed', 'true');

    // Toggle the chevron
    await codesPage.getByRole('button', { name: collapseLabel(codeA.name) }).click();

    // Code A is still selected
    await expect(rowBody).toHaveAttribute('aria-pressed', 'true');
  });

  test('selecting a different code deselects the previous one', async ({ codesPage }) => {
    const rowBodyA = codesPage.getByRole('button', { name: rowBodyLabel(codeA.code, codeA.name) });
    const rowBodyB = codesPage.getByRole('button', { name: rowBodyLabel('B', 'Bergverksdrift og utvinning') });

    await rowBodyA.click();
    await expect(rowBodyA).toHaveAttribute('aria-pressed', 'true');
    await expect(rowBodyB).toHaveAttribute('aria-pressed', 'false');

    await rowBodyB.click();
    await expect(rowBodyB).toHaveAttribute('aria-pressed', 'true');
    await expect(rowBodyA).toHaveAttribute('aria-pressed', 'false');
  });

  test('expanding a child node reveals grandchildren', async ({ codesPage }) => {
    // 01 is already visible (A is expanded by default)
    const code01Body = codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) });
    await expect(code01Body).toBeVisible();

    // expand 01 to see its child (011)
    const code01Chevron = codesPage.getByRole('button', { name: expandLabel(code01.name) });
    await code01Chevron.click();

    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code011.code, code011.name) })).toBeVisible();
  });
});

// ── /classifications/2003/codes/version/1 ──────────────────────────────────────

test.describe('/classifications/[id]/codes/version/[versionNumber]', () => {
  test('renders the code tree for the given version', async ({ page, codesVersionPage: _ }) => {
    await page.goto(CODES_VERSION_URL);
    await expect(page.getByRole('tree', { name: localization.codeTree.label })).toBeVisible();
  });

  test('version top-level codes are visible and children collapsed', async ({ page }) => {
    await page.goto(CODES_VERSION_URL);

    // Version mock has A and B at top level
    await expect(
      page.getByRole('button', { name: rowBodyLabel('A', 'Jordbruk, skogbruk og fiske (v1)') }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: rowBodyLabel('B', 'Bergverksdrift og utvinning (v1)') }),
    ).toBeVisible();

    // Child 01 should be collapsed
    await expect(
      page.getByRole('button', { name: rowBodyLabel('01', 'Jordbruk og tjenester tilknyttet jordbruk (v1)') }),
    ).not.toBeVisible();
  });
});
