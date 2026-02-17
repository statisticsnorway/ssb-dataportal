import { test as base, expect } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { RenderedView, RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { areFieldsDefinedAndNonNull } from '@/utils/functions';

type VariablePageFixture = (variable: RenderedView) => Promise<void>;

const variableDefinitions = variableDefinitionsJson
  .map(RenderedViewFromJSON)
  .filter((v) => areFieldsDefinedAndNonNull(v, ['short_name', 'name']))
  .slice(0, 4);
const noVariables = variableDefinitions.length === 0;

const test = base.extend<{
  goToVariable: VariablePageFixture;
}>({
  goToVariable: async ({ page }, use) => {
    await use(async (variable: RenderedView) => {
      if (!variable.name || !variable.short_name) {
        throw new Error('Variable is missing required fields');
      }
      await page.goto(tabsData.VariableDefinitions.route);
      await page.getByRole('link', { name: variable.name }).click();
      await expect(page).toHaveURL(`${tabsData.VariableDefinitions.route}/${variable.short_name}`);
    });
  },
});

test.describe('Variable definitions navigation', () => {
  test.skip(noVariables, 'No variable definitions available to test');
  test.describe;
  for (const variable of variableDefinitions) {
    test(`Navigate to ${variable.name}`, async ({ goToVariable, page }) => {
      await goToVariable(variable);
      await expect(
        page.getByRole('heading', {
          level: 1,
          name: `${variable.name}${variable.short_name}`,
        }),
      ).toBeVisible();
    });
  }
});

test.describe('Variable definitions breadcrumbs', () => {
  test.skip(noVariables, 'No variable definitions available to test');
  test('renders correct breadcrumb structure and current page', async ({ goToVariable, page }) => {
    const variable = variableDefinitions[0];
    await goToVariable(variable);
    const nav = page.getByTestId('vardefBreadcrumbs');
    await expect(nav).toBeVisible();
    const items = nav.locator('ol > li');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0).locator('a'), 'First crumb is link').toHaveCount(1);
    await expect(items.nth(1).locator('a'), 'Second crumb is link').toHaveCount(1);
    const current = items.nth(2);
    const currentElement = current.locator('[aria-current="page"]');
    await expect(currentElement, 'Last crumb is current').toBeVisible();
    const before = page.url();
    await currentElement.click({ trial: true });
    await currentElement.click();
    await expect(page).toHaveURL(before);
    await expect(current).toContainText(variable.name);
  });

  test('click on "Home" navigates to /', async ({ page, goToVariable }) => {
    test.skip(noVariables, 'No variable definitions available to test');
    const variable = variableDefinitions[0];
    await goToVariable(variable);
    const nav = page.getByRole('navigation', { name: localization.breadcrumbsLabel });
    nav.getByRole('link', { name: localization.home }).click();
    await expect(page).toHaveURL('/');
  });

  test('click on "Variabeldefinisjoner" navigates to search result', async ({ page, goToVariable }) => {
    test.skip(noVariables, 'No variable definitions available to test');
    const variable = variableDefinitions[0];
    await goToVariable(variable);
    const nav = page.getByRole('navigation', { name: localization.breadcrumbsLabel });
    nav.getByRole('link', { name: localization.variableDefinition.labelPlural }).click();
    await expect(page).toHaveURL(tabsData.VariableDefinitions.route);
  });
});

test.describe('Variable definition details – not found', () => {
  test('Unknown shortName shows not-found page with breadcrumbs and warning alert', async ({ page }) => {
    const missingShortName = `missing-${Date.now()}`;
    await page.goto(`/variable-definitions/${missingShortName}`);
    const root = page.getByTestId('vardefBreadcrumbs');
    await expect(root).toBeVisible();
    const alert = page.locator('.ds-alert').filter({ hasText: /Variabeldefinisjon ikke funnet/i });
    await expect(alert).toBeVisible();
  });
});
