import { expect, test } from '@playwright/test';
import { localization } from '@/libs/language';
import { classificationsPath, datasetPath, variableDefinitionsPath } from '@/utils/constants';

test.describe('Tabs navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/variable-definitions');
  });

  test('navigate to classifications', async ({ page }) => {
    const klassTab = page.getByRole('tab', { name: localization.classifications });

    // Wait for visible
    await expect(klassTab).toBeVisible({ timeout: 5000 });
    await expect(klassTab).toBeEnabled();

    // Wait before click tab
    await Promise.all([page.waitForURL(classificationsPath), klassTab.click()]);
    // Expect classifications url
    await expect(page).toHaveURL(classificationsPath);
  });

  test('navigate to datasets', async ({ page }) => {
    const datasetTab = page.getByRole('tab', { name: localization.dataset });

    // Wait for visible
    await expect(datasetTab).toBeVisible({ timeout: 5000 });
    await expect(datasetTab).toBeEnabled();

    // Wait before click tab
    await Promise.all([page.waitForURL(datasetPath), datasetTab.click()]);

    // Expect datasets url
    await expect(page).toHaveURL(datasetPath);
  });

  test('navigate to variable definitions', async ({ page }) => {
    const vardefTab = page.getByRole('tab', { name: localization.variableDefinitions });

    // Wait for visible
    await expect(vardefTab).toBeVisible({ timeout: 5000 });
    await expect(vardefTab).toBeEnabled();

    // Wait before click tab
    await Promise.all([page.waitForURL(variableDefinitionsPath), vardefTab.click()]);

    // Expect variable definitions url
    await expect(page).toHaveURL(variableDefinitionsPath);
  });
});
