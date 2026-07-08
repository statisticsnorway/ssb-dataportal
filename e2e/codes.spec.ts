import { localization } from '@/libs/language';
import { expect, test, CODES_VERSION_URL } from './fixtures/codesPage.fixture';

const codeA = { code: 'A', name: 'Jordbruk, skogbruk og fiske' };
const code01 = { code: '01', name: 'Jordbruk og tjenester tilknyttet jordbruk' };
const code02 = { code: '02', name: 'Skogbruk og tjenester tilknyttet skogbruk' };
const code011 = { code: '011', name: 'Dyrking av ettårige vekster' };

const rowBodyLabel = (code: string, name: string) => `${localization.codeTree.selectCode} ${code}: ${name}`;
const expandLabel = (name: string) => `${localization.codeTree.expand} ${name}`;
const collapseLabel = (name: string) => `${localization.codeTree.collapse} ${name}`;

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

  test('second-level codes are not visible on page load', async ({ codesPage }) => {
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) })).not.toBeVisible();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code02.code, code02.name) })).not.toBeVisible();
  });

  test('top-level code A has a collapsed chevron on page load', async ({ codesPage }) => {
    const chevron = codesPage.getByRole('button', { name: expandLabel(codeA.name) });
    await expect(chevron).toBeVisible();
    await expect(chevron).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking chevron expands code A and shows its children', async ({ codesPage }) => {
    await codesPage.getByRole('button', { name: expandLabel(codeA.name) }).click();

    const collapseChevron = codesPage.getByRole('button', { name: collapseLabel(codeA.name) });
    await expect(collapseChevron).toBeVisible();
    await expect(collapseChevron).toHaveAttribute('aria-expanded', 'true');

    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) })).toBeVisible();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code02.code, code02.name) })).toBeVisible();
  });

  test('clicking chevron again collapses code A', async ({ codesPage }) => {
    await codesPage.getByRole('button', { name: expandLabel(codeA.name) }).click();
    await codesPage.getByRole('button', { name: collapseLabel(codeA.name) }).click();

    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) })).not.toBeVisible();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code02.code, code02.name) })).not.toBeVisible();
  });

  test('clicking a row body selects the code (aria-pressed becomes true)', async ({ codesPage }) => {
    const rowBody = codesPage.getByRole('button', { name: rowBodyLabel(codeA.code, codeA.name) });

    await expect(rowBody).toHaveAttribute('aria-pressed', 'false');
    await rowBody.click();
    await expect(rowBody).toHaveAttribute('aria-pressed', 'true');
  });

  test('clicking chevron does not change the selected code', async ({ codesPage }) => {
    const rowBody = codesPage.getByRole('button', { name: rowBodyLabel(codeA.code, codeA.name) });
    await rowBody.click();
    await expect(rowBody).toHaveAttribute('aria-pressed', 'true');

    await codesPage.getByRole('button', { name: collapseLabel(codeA.name) }).click();

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
    await codesPage.getByRole('button', { name: expandLabel(codeA.name) }).click();

    const code01Body = codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) });
    await expect(code01Body).toBeVisible();

    await codesPage.getByRole('button', { name: expandLabel(code01.name) }).click();

    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code011.code, code011.name) })).toBeVisible();
  });

  test('filter input narrows the tree by code', async ({ codesPage }) => {
    const filterInput = codesPage.getByLabel(localization.codeTree.filterLabel);

    await filterInput.fill('01');

    await expect(codesPage.getByRole('button', { name: rowBodyLabel(codeA.code, codeA.name) })).toBeVisible();
    await expect(
      codesPage.getByRole('button', { name: rowBodyLabel('B', 'Bergverksdrift og utvinning') }),
    ).not.toBeVisible();

    await codesPage.getByRole('button', { name: expandLabel(codeA.name) }).click();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel(code01.code, code01.name) })).toBeVisible();
  });

  test('filter input narrows the tree by name and clear resets it', async ({ codesPage }) => {
    const filterInput = codesPage.getByLabel(localization.codeTree.filterLabel);

    await filterInput.fill('skogbruk');

    await expect(codesPage.getByRole('button', { name: rowBodyLabel(codeA.code, codeA.name) })).toBeVisible();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel('C', 'Industri') })).not.toBeVisible();

    await codesPage.getByRole('button', { name: localization.codeTree.clearFilter }).click();

    await expect(
      codesPage.getByRole('button', { name: rowBodyLabel('B', 'Bergverksdrift og utvinning') }),
    ).toBeVisible();
    await expect(codesPage.getByRole('button', { name: rowBodyLabel('C', 'Industri') })).toBeVisible();
  });
});

test.describe('/classifications/[id]/codes/version/[versionNumber]', () => {
  test('renders the code tree for the given version', async ({ page, codesVersionPage: _ }) => {
    await page.goto(CODES_VERSION_URL);
    await expect(page.getByRole('tree', { name: localization.codeTree.label })).toBeVisible();
  });

  test('version top-level codes are visible and children are collapsed on page load', async ({ page }) => {
    await page.goto(CODES_VERSION_URL);

    await expect(
      page.getByRole('button', { name: rowBodyLabel('A', 'Jordbruk, skogbruk og fiske (v1)') }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: rowBodyLabel('B', 'Bergverksdrift og utvinning (v1)') }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: rowBodyLabel('01', 'Jordbruk og tjenester tilknyttet jordbruk (v1)') }),
    ).not.toBeVisible();

    await expect(
      page.getByRole('button', { name: `${localization.codeTree.expand} Jordbruk, skogbruk og fiske (v1)` }),
    ).toBeVisible();
  });
});
