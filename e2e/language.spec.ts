import { expect, test } from '@bgotink/playwright-coverage';
import { Browser } from '@playwright/test';
import { languageCookieName } from '@/libs/language/src/localization';
import { EN_LABEL, LANGUAGE_LABEL, NB_LABEL, NN_LABEL } from '@/components/language-picker/constants';

test.describe('language picker', () => {
  test.use({
    extraHTTPHeaders: {
      'accept-language': 'nb-NO,nb;q=0.9',
    },
  });

  test.beforeEach(async ({ context }, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await context.clearCookies();
  });

  test('shows current language and available options', async ({ page }) => {
    await page.goto('/');

    const languageTrigger = page.getByRole('button', { name: LANGUAGE_LABEL });
    await expect(languageTrigger).toBeVisible();

    await languageTrigger.click();
    await expect(page.getByRole('button', { name: NB_LABEL })).toBeVisible();
    await expect(page.getByRole('button', { name: NN_LABEL })).toBeVisible();
    await expect(page.getByRole('button', { name: EN_LABEL })).toBeVisible();
  });

  test('can switch to Nynorsk and keeps preference after reload', async ({ context, page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: LANGUAGE_LABEL }).click();
    await page.getByRole('button', { name: NB_LABEL }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
    await expect(page.getByText('Kva er SSB Dataportal?')).toBeVisible();

    const languageCookie = (await context.cookies()).find((cookie) => cookie.name === languageCookieName);
    expect(languageCookie?.value).toBe('nn');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
    await expect(page.getByText('Kva er SSB Dataportal?')).toBeVisible();
  });

  test('can switch to English and keeps preference after reload', async ({ context, page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: LANGUAGE_LABEL }).click();
    await page.getByRole('button', { name: NB_LABEL }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: 'What is SSB Dataportal?' })).toBeVisible();

    const languageCookie = (await context.cookies()).find((cookie) => cookie.name === languageCookieName);
    expect(languageCookie?.value).toBe('en');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: 'What is SSB Dataportal?' })).toBeVisible();
  });
});

test.describe('automatic locale mapping', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
  });

  const openPageWithLocale = async (browser: Browser, locale: string) => {
    const context = await browser.newContext({
      locale,
    });
    await context.clearCookies();
    const page = await context.newPage();
    await page.goto('/');
    return { context, page };
  };

  test('uses Nynorsk automatically when locale is Nynorsk', async ({ browser }) => {
    const { context, page } = await openPageWithLocale(browser, 'nn-NO');

    await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
    await expect(page.getByText('Kva er SSB Dataportal?')).toBeVisible();

    await context.close();
  });

  test('uses Bokmal automatically when locale is Danish', async ({ browser }) => {
    const { context, page } = await openPageWithLocale(browser, 'da-DK');

    await expect(page.locator('html')).toHaveAttribute('lang', 'nb');
    await expect(page.getByText('Hva er SSB Dataportal?')).toBeVisible();

    await context.close();
  });

  test('uses Bokmal automatically when locale is Swedish', async ({ browser }) => {
    const { context, page } = await openPageWithLocale(browser, 'sv-SE');

    await expect(page.locator('html')).toHaveAttribute('lang', 'nb');
    await expect(page.getByText('Hva er SSB Dataportal?')).toBeVisible();

    await context.close();
  });

  test('uses English automatically for other locales', async ({ browser }) => {
    const { context, page } = await openPageWithLocale(browser, 'de-DE');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: 'What is SSB Dataportal?' })).toBeVisible();

    await context.close();
  });
});
