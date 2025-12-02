import { expect, test } from '@playwright/test';

test.describe('Navigation at start', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('redirects to variable-definitions', async ({ page }) => {
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/variable-definitions$/);
  });

  test('Goto a variabledefinition', async ({ page }) => {
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/variable-definitions$/);
    await page.getByRole('link', { name: 'Kommunenummer' }).dblclick();
    await expect(page).toHaveURL(/\/variable-definitions\/0O1QLezw/);
    await expect(page.getByRole('heading', { name: 'Kommunenummer' })).toBeVisible();
  });
});
