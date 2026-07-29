import { expect, test } from '@bgotink/playwright-coverage';
import { en } from '@/libs/language/src/en';
import { languageCookieName } from '@/libs/language/src/localization';
import { nb } from '@/libs/language/src/nb';
import { nn } from '@/libs/language/src/nn';

test.describe('language picker', () => {
  test.beforeEach(async ({ context }, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await context.clearCookies();
  });

  test('shows current language and available options', async ({ page }) => {
    await page.goto('/');

    const languageTrigger = page.getByRole('button', { name: nb.language.label });
    await expect(languageTrigger).toBeVisible();

    await languageTrigger.click();
    await expect(page.getByRole('button', { name: nb.language.nb })).toBeVisible();
    await expect(page.getByRole('button', { name: nb.language.nn })).toBeVisible();
    await expect(page.getByRole('button', { name: nb.language.en })).toBeVisible();
  });

  test('can switch to Nynorsk and keeps preference after reload', async ({ context, page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: nb.language.label }).click();
    await page.getByRole('button', { name: nb.language.nn }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
    await expect(page.getByRole('button', { name: nn.language.label })).toBeVisible();

    const languageCookie = (await context.cookies()).find((cookie) => cookie.name === languageCookieName);
    expect(languageCookie?.value).toBe('nn');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
    await expect(page.getByRole('button', { name: nn.language.label })).toBeVisible();
  });

  test('can switch to English and keeps preference after reload', async ({ context, page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: nb.language.label }).click();
    await page.getByRole('button', { name: nb.language.en }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: en.language.label })).toBeVisible();

    const languageCookie = (await context.cookies()).find((cookie) => cookie.name === languageCookieName);
    expect(languageCookie?.value).toBe('en');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: en.language.label })).toBeVisible();
  });
});
