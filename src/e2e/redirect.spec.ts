import { expect, test } from '@playwright/test';

test('redirects to variable-definitions', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('load');

  await expect(page).toHaveURL(/\/variable-definitions$/);
});
