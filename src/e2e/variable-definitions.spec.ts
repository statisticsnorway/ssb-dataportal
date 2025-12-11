import { expect, test } from '@playwright/test';

// This test should eventually test primarly what user can see and interact with on the
// variable definitions overview page
test.describe('Navigation variable definitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/variable-definitions$/);
  });
});
