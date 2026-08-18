import { localization } from '@/libs/language';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { expect, test } from './fixtures/variableDefinitions.fixture';
import { CLASSIFICATIONS_URL } from './utils/variables';

test.describe('Tabs navigation', () => {
  test('navigate to classifications', async ({ variableDefinitionsPage: page }) => {
    const klassTab = page.getByRole('tab', { name: localization.tabs.classifications });

    await expect(klassTab).toBeEnabled();

    await Promise.all([page.waitForURL(buildUrl({})), klassTab.click()]);
    await expect(page).toHaveURL(CLASSIFICATIONS_URL);
  });

  test('navigate to data products', async ({ variableDefinitionsPage: page }) => {
    const dataProductsTab = page.getByRole('tab', { name: localization.tabs.dataProducts });

    await expect(dataProductsTab).toBeEnabled();

    await Promise.all([page.waitForURL('/data-products'), dataProductsTab.click()]);
    await expect(page).toHaveURL('/data-products');
  });

  test('navigate to variable definitions', async ({ variableDefinitionsPage: page }) => {
    const vardefTab = page.getByRole('tab', { name: localization.tabs.variableDefinitions });

    await expect(vardefTab).toBeEnabled();

    await Promise.all([page.waitForURL('/variable-definitions'), vardefTab.click()]);

    await expect(page).toHaveURL('/variable-definitions');
  });
});
