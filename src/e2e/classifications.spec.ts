import { expect, test } from '@playwright/test';

// This test should eventually test primarly what user can see and interact with on the
// classifications overview page
test.describe('Navigation classifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/classifications');
    await expect(page).toHaveURL(/\/classifications$/);
  });
});
