import { localization } from '@/libs/language';
import { expect, test } from './fixtures/variableDefinitions.fixture';

test.describe('Tabs navigation', () => {
  test('navigate to classifications', async ({ variableDefinitionsPage }) => {
    const klassTab = variableDefinitionsPage.getByRole('tab', { name: localization.tabs.classifications });

    await expect(klassTab).toBeEnabled();

    await Promise.all([variableDefinitionsPage.waitForURL('/classifications'), klassTab.click()]);
    await expect(variableDefinitionsPage).toHaveURL('/classifications');
  });

  test('navigate to datasets', async ({ variableDefinitionsPage }) => {
    const datasetTab = variableDefinitionsPage.getByRole('tab', { name: localization.tabs.datasets });

    await expect(datasetTab).toBeEnabled();

    await Promise.all([variableDefinitionsPage.waitForURL('/datasets'), datasetTab.click()]);
    await expect(variableDefinitionsPage).toHaveURL('/datasets');
  });

  test('navigate to variable definitions', async ({ variableDefinitionsPage }) => {
    const vardefTab = variableDefinitionsPage.getByRole('tab', { name: localization.tabs.variableDefinitions });

    await expect(vardefTab).toBeEnabled();

    await Promise.all([variableDefinitionsPage.waitForURL('/variable-definitions'), vardefTab.click()]);

    await expect(variableDefinitionsPage).toHaveURL('/variable-definitions');
  });
});
