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

  test('can switch to Nynorsk and keeps preference after reload', async ({ context, page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: LANGUAGE_LABEL }).click();
    const nynorskOption = page.getByRole('button', { name: NN_LABEL });
    await expect(nynorskOption).toBeVisible();
    await nynorskOption.click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
    await expect(page.getByRole('heading', { level: 1, name: 'Klassifikasjonar' })).toBeVisible();

    await expect
      .poll(async () => {
        const languageCookie = (await context.cookies()).find((cookie) => cookie.name === languageCookieName);
        return languageCookie?.value;
      })
      .toBe('nn');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
    await expect(page.getByRole('heading', { level: 1, name: 'Klassifikasjonar' })).toBeVisible();
  });

  test('can switch to English and keeps preference after reload', async ({ context, page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: LANGUAGE_LABEL }).click();
    await page.getByRole('button', { name: EN_LABEL }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: 'Classifications' })).toBeVisible();

    const languageCookie = (await context.cookies()).find((cookie) => cookie.name === languageCookieName);
    expect(languageCookie?.value).toBe('en');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: 'Classifications' })).toBeVisible();
  });
});

test.describe('automatic locale mapping', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
  });

  const openPageWithLocale = async (browser: Browser, locale: string) => {
    const language = locale.split('-')[0];
    const context = await browser.newContext({
      locale,
      extraHTTPHeaders: {
        'accept-language': `${locale},${language};q=0.9`,
      },
    });
    await context.clearCookies();
    const page = await context.newPage();
    await page.goto('/');
    return { context, page };
  };

  test('uses Nynorsk automatically when locale is Nynorsk', async ({ browser }) => {
    const { context, page } = await openPageWithLocale(browser, 'nn-NO');

    await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
    await expect(page.getByRole('heading', { level: 1, name: 'Klassifikasjonar' })).toBeVisible();

    await context.close();
  });

  test('uses Bokmal automatically when locale is Danish', async ({ browser }) => {
    const { context, page } = await openPageWithLocale(browser, 'da-DK');

    await expect(page.locator('html')).toHaveAttribute('lang', 'nb');
    await expect(page.getByRole('heading', { level: 1, name: 'Klassifikasjoner' })).toBeVisible();

    await context.close();
  });

  test('uses Bokmal automatically when locale is Swedish', async ({ browser }) => {
    const { context, page } = await openPageWithLocale(browser, 'sv-SE');

    await expect(page.locator('html')).toHaveAttribute('lang', 'nb');
    await expect(page.getByRole('heading', { level: 1, name: 'Klassifikasjoner' })).toBeVisible();

    await context.close();
  });

  test('uses English automatically for other locales', async ({ browser }) => {
    const { context, page } = await openPageWithLocale(browser, 'de-DE');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: 'Classifications' })).toBeVisible();

    await context.close();
  });
});
