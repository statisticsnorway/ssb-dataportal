import { expect, test } from '@playwright/test';
import { localization } from '@/libs/language';

test.describe('Navigation variable definitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});

test('Navigate from landingpage', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toContainText(localization.info.landingPageTitle);
  await page.getByRole('link', { name: localization.variableDefinitions }).click();
  await expect(page.getByRole('tab', { name: localization.variableDefinitions })).toBeVisible();
  await expect(page.locator('#tab-_r_3_')).toContainText(localization.variableDefinitions);
  await page.getByRole('link', { name: 'Statistics Norway logo' }).click();
  await expect(page.getByRole('heading')).toContainText(localization.info.landingPageTitle);
});
