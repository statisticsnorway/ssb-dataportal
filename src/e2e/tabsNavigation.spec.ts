import { test, expect } from '@playwright/test';


test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('redirects to variable-definitions', async ({ page }) => {
        await page.waitForLoadState('load');

        await expect(page).toHaveURL(/\/variable-definitions$/);
    });

});