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

test('Navigate to up to 4 variable definitions', async ({ goToVariable, page }) => {
  const validVariables = variableDefinitions.filter((v) => areFieldsDefinedAndNonNull(v, ['id', 'name'])).slice(0, 4);

  if (validVariables.length === 0) {
    test.skip();
    return;
  }

  for (const variable of validVariables) {
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
