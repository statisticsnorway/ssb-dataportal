import { expect, test } from '@playwright/test';

test.describe('Navigation at start', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('redirects to variable-definitions', async ({ page }) => {
    await page.waitForLoadState('load');

    await expect(page).toHaveURL(/\/variable-definitions$/);
  });
});
