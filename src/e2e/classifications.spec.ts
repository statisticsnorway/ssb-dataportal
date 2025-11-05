import { test, expect } from '@playwright/test';

test.describe('ClassificationsPage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/classifications');
    });

    test('renders the page with filters and classifications', async ({ page }) => {
        // Check that filters exist
        await expect(page.locator('text=Kodeverk type')).toBeVisible();
    });
});