import { expect, test } from '@playwright/test';
import { classificationsPath } from '@/utils/constants';

// This test should eventually test primarly what user can see and interact with on the
// classifications overview page
test.describe('Navigation classifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(classificationsPath);
    await expect(page).toHaveURL(classificationsPath);
  });
});
