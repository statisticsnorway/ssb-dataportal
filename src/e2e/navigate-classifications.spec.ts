import { expect, test } from '@playwright/test';

test.describe('Navigation classifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/classifications');
    await expect(page).toHaveURL(/\/classifications$/);
  });
});
