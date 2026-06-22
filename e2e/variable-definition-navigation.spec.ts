import { TestInfo } from '@playwright/test';
import { test as base, expect } from '@bgotink/playwright-coverage';
import assert from 'assert';
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
  goToVariable: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
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
  for (const variable of variableDefinitions) {
    test(`Navigate to ${variable.name}`, async ({ goToVariable, page }) => {
      await goToVariable(variable);
      await expect(
        page.getByRole('heading', {
          level: 1,
          name: `${variable.name}`,
        }),
      ).toBeVisible();
    });
  }
});

test.describe('Variable definitions breadcrumbs', () => {
  test.skip(noVariables, 'No variable definitions available to test');
  test('renders correct breadcrumb structure and current page', async ({ goToVariable, page }) => {
    const variable = variableDefinitions[0];
    assert(variable);
    await goToVariable(variable);
    const nav = page.getByRole('navigation', { name: localization.breadcrumbsLabel });
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
    await expect(current).toContainText(variable.short_name);
  });

  test('click on "Home" navigates to /', async ({ page, goToVariable }) => {
    test.skip(noVariables, 'No variable definitions available to test');
    const variable = variableDefinitions[0];
    assert(variable);
    await goToVariable(variable);
    const nav = page.getByRole('navigation', { name: localization.breadcrumbsLabel });
    nav.getByRole('link', { name: localization.home }).click();
    await expect(page).toHaveURL('/');
  });

  test('click on "Variabeldefinisjoner" navigates to search result', async ({ page, goToVariable }) => {
    test.skip(noVariables, 'No variable definitions available to test');
    const variable = variableDefinitions[0];
    assert(variable);
    await goToVariable(variable);
    const nav = page.getByRole('navigation', { name: localization.breadcrumbsLabel });
    nav.getByRole('link', { name: localization.variableDefinition.labelPlural }).click();
    await expect(page).toHaveURL(tabsData.VariableDefinitions.route);
  });
});
