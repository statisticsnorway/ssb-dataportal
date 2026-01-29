import { expect, test } from '@playwright/test';
import { localization } from '@/libs/language';

test.describe('Tabs navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/variable-definitions');
  });

  test('navigate to classifications', async ({ page }) => {
    const klassTab = page.getByRole('tab', { name: localization.tabs.classifications });

    // Wait for visible
    await expect(klassTab).toBeVisible({ timeout: 5000 });
    await expect(klassTab).toBeEnabled();

    // Wait before click tab
    await Promise.all([page.waitForURL('/classifications'), klassTab.click()]);
    // Expect classifications url
    await expect(page).toHaveURL('/classifications');
  });

  test('navigate to datasets', async ({ page }) => {
    const datasetTab = page.getByRole('tab', { name: localization.tabs.datasets });

    // Wait for visible
    await expect(datasetTab).toBeVisible({ timeout: 5000 });
    await expect(datasetTab).toBeEnabled();

    // Wait before click tab
    await Promise.all([page.waitForURL('/datasets'), datasetTab.click()]);
    // Expect classifications url
    await expect(page).toHaveURL('/datasets');
  });

  test('navigate to variable definitions', async ({ page }) => {
    const vardefTab = page.getByRole('tab', { name: localization.tabs.variableDefinitions });

    // Wait for visible
    await expect(vardefTab).toBeVisible({ timeout: 5000 });
    await expect(vardefTab).toBeEnabled();

    // Wait before click tab
    await Promise.all([page.waitForURL('/variable-definitions'), vardefTab.click()]);

    // Expect variable definitions url
    await expect(page).toHaveURL('/variable-definitions');
  });
});
