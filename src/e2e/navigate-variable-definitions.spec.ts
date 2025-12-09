import { expect, test } from '@playwright/test';

test.describe('Navigation variable definitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/variable-definitions$/);
  });
});
