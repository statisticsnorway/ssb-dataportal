import { expect, test } from '@bgotink/playwright-coverage';
import { localization } from '@/libs/language';

test.describe('Home redirect', () => {
  test('redirects from / to classifications', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/classifications(\?.*)?$/);
    await expect(page.getByRole('heading', { level: 1, name: localization.tabs.classifications })).toBeVisible();
  });
});
