import { test as base, expect } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { RenderedView, RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { areFieldsDefinedAndNonNull } from '@/utils/functions';

type VariablePageFixture = (variable: RenderedView) => Promise<void>;

const variableDefinitions = variableDefinitionsJson
  .map(RenderedViewFromJSON)
  .filter((v) => areFieldsDefinedAndNonNull(v, ['short_name', 'name']))
  .slice(0, 4);

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
  if (variableDefinitions.length === 0) {
    test.skip();
  }

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
