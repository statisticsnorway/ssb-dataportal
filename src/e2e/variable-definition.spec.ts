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

      // Wait for the link to be visible before clicking
      const link = page.getByRole('link', { name: variable.name });
      await expect(link).toBeVisible({ timeout: 5000 });

      await Promise.all([page.waitForURL(new RegExp(`/variable-definitions/${variable.id}`)), link.click()]);
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
    await expect(header).toHaveText(`${variable.name}${variable.short_name}`);

    // Return to variable-definitions page safely
    const homeLink = page.getByRole('link', { name: localization.navigateHomeVariableDefinitions });
    await expect(homeLink).toBeVisible({ timeout: 5000 });

    await Promise.all([page.waitForURL(/\/variable-definitions$/), homeLink.click()]);

    // Wait for variable-defintions page to be ready for next iteration
    await expect(page.getByRole('tab', { name: localization.tabs.variableDefinitions })).toBeVisible({ timeout: 5000 });
  }
});
