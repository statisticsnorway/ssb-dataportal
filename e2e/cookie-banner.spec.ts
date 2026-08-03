import { expect, test } from '@bgotink/playwright-coverage';
import { cookieBannerDismissedCookieName } from '@/libs/language/src/localization';
import { nb } from '@/libs/language/src/nb';

test.describe('cookie banner', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('is visible for first-time visitors', async ({ page }) => {
    await page.goto('/');

    const banner = page.locator(`section[aria-label="${nb.cookieBanner.label}"]`);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(nb.cookieBanner.message);
    await expect(page.getByRole('button', { name: nb.cookieBanner.closeButtonLabel })).toBeVisible();
  });

  test('can be dismissed and stays hidden after reload', async ({ context, page }) => {
    await page.goto('/');

    const banner = page.locator(`section[aria-label="${nb.cookieBanner.label}"]`);
    await expect(banner).toBeVisible();

    await page.getByRole('button', { name: nb.cookieBanner.closeButtonLabel }).click();
    await expect(banner).toHaveCount(0);

    const dismissedCookie = (await context.cookies()).find((cookie) => cookie.name === cookieBannerDismissedCookieName);
    expect(dismissedCookie?.value).toBe('true');

    await page.reload();
    await expect(page.locator(`section[aria-label="${nb.cookieBanner.label}"]`)).toHaveCount(0);
  });
});
