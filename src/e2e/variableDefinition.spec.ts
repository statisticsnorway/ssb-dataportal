import { test as base, expect } from '@playwright/test';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import variableDefinitions from '../static-data/variable-definitions.json';

type VariablePageFixture = (variable: (typeof variableDefinitions)[number]) => Promise<void>;

const test = base.extend<{
  variablePage: VariablePageFixture;
}>({
  variablePage: async ({ page }, use) => {
    const goToVariable = async (variable: RenderedView) => {
      await page.goto('/variable-definitions');
      if (!variable.name) {
        throw new Error('Variable name is missing');
      }
      await page.getByRole('link', { name: variable.name }).click();
      await expect(page).toHaveURL(new RegExp(`/variable-definitions/${variable.id}`));
    };
    // await page.getByRole('link', { name: variable.name ?? '' }).click();
    await use(goToVariable);
  },
});

export { expect };

test.describe('Details variable definition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/variable-definitions');
  });

  test('go to variable-definition', async ({ page }) => {
    await page.waitForLoadState('load');

    const variable = variableDefinitions[0];

    await page.getByRole('link', { name: variable.name }).click();
    await expect(page).toHaveURL(new RegExp(`/variable-definitions/${variable.id}`));
  });

  // If not using test data this could break
  test('Variable definition header', async ({ page }) => {
    const variable = variableDefinitions[0];
    await page.getByRole('link', { name: variable.name }).click();
    await expect(page).toHaveURL(new RegExp(`/variable-definitions/${variable.id}`));

    const header = page.locator('h1');
    await expect(header).toBeVisible();
    await expect(header).toHaveText(variable.name);
  });

  for (const variable of variableDefinitions) {
    test(`Variable definition: ${variable.name}`, async ({ page }) => {
      await page.goto('/variable-definitions');

      await page.getByRole('link', { name: variable.name }).click();
      await expect(page).toHaveURL(new RegExp(`/variable-definitions/${variable.id}`));

      const header = page.locator('h1');
      await expect(header).toBeVisible();
      await expect(header).toHaveText(variable.name);

      await page.getByRole('link', { name: localization.navigateHomeVariableDefinitions }).click();
      await expect(page.getByRole('link', { name: localization.navigateHomeVariableDefinitions })).toBeVisible();

      await page.waitForLoadState('load');
      await expect(page).toHaveURL(/\/variable-definitions$/);
    });
  }
});
