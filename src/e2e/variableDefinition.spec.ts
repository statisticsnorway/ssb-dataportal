import { test as base, expect } from '@playwright/test';
import { RenderedView, RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { areFieldsDefinedAndNonNull } from '@/utils/functions';

type VariablePageFixture = (variable: RenderedView) => Promise<void>;

const variableDefinitions = variableDefinitionsJson.map(RenderedViewFromJSON);

const test = base.extend<{
  goToVariable: VariablePageFixture;
}>({
  goToVariable: async ({ page }, use) => {
    const goToVariable = async (variable: RenderedView) => {
      await page.goto('/variable-definitions');
      if (!variable.name) {
        throw new Error('Variable name is missing');
      }
      await page.getByRole('link', { name: variable.name }).click();
      await expect(page).toHaveURL(new RegExp(`/variable-definitions/${variable.id}`));
    };
    await use(goToVariable);
  },
});

test('Navigate to all variable definitions one by one', async ({ goToVariable, page }) => {
  for (const variable of variableDefinitions) {
    if (!areFieldsDefinedAndNonNull(variable, ['id', 'name'])) {
      test.skip();
      continue;
    }

    // Go to the variable
    await goToVariable(variable);

    // Check header
    const header = page.locator('h1');
    await expect(header).toBeVisible();
    await expect(header).toHaveText(variable.name);

    // Return to variable definitions
    await page.getByRole('link', { name: localization.navigateHomeVariableDefinitions }).click();
    await expect(page.getByRole('link', { name: localization.navigateHomeVariableDefinitions })).toBeVisible();
    await expect(page).toHaveURL(/\/variable-definitions$/);
  }
});
/*
test('go to variable-definition', async ({ page }) => {
  await page.waitForLoadState('load');
  if (!areFieldsDefinedAndNonNull(variable, ['id', 'name'])) {
    test.skip();
  } else {
    await page.getByRole('link', { name: variable.name }).click();
    await expect(page).toHaveURL(new RegExp(`/variable-definitions/${variable.id}`));
  }
});

test('Variable definition header', async ({ goToVariable, page }) => {
  await goToVariable(variable);

  if (!areFieldsDefinedAndNonNull(variable, ['id', 'name'])) {
    test.skip();
  } else {
    await expect(page.locator('h1')).toHaveText(variable.name);
  }
});

test('Return to variable definitions ', async ({ goToVariable, page }) => {
  await goToVariable(variable);

  if (!areFieldsDefinedAndNonNull(variable, ['id', 'name'])) {
    test.skip();
  } else {
    await page.getByRole('link', { name: localization.navigateHomeVariableDefinitions }).click();
    await expect(page.getByRole('link', { name: localization.navigateHomeVariableDefinitions })).toBeVisible();

    //await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/variable-definitions$/);
  }
});

for (const variable of variableDefinitions) {
  test(`Variable definition: ${variable.name}`, async ({ page }) => {});
}
*/
