import { test, expect } from '@bgotink/playwright-coverage';
import { TestInfo } from '@playwright/test';
import { localization } from '@/libs/language';
import { stabilize } from './utils/commonUtils';
import { ACCESSIBILITY_STATEMENT_URL, PRIVACY_STATEMENT_URL } from '@/config/constants';

test.describe('footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await stabilize();
  });

  test('Klassifikasjoner API documentation link is visible in the footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: localization.apiDocKlass })).toBeVisible();
  });

  test('Vardef API documentation link is visible in the footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: localization.apiDocVardef })).toBeVisible();
  });

  test('Accessibility statement link is visible in the footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: localization.info.footerAccessibilityStatement })).toBeVisible();
  });

  test('Vardef API documentation link points to the test docs URL when not authenticated', async ({
    page,
  }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const footer = page.getByRole('contentinfo');
    const link = footer.getByRole('link', { name: localization.apiDocVardef });
    await expect(link).toHaveAttribute('href', 'https://metadata.test.ssb.no/docs/swagger/variable-definitions');
  });

  test('Klassifikasjoner API documentation link points to the test docs URL when not authenticated', async ({
    page,
  }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const footer = page.getByRole('contentinfo');
    const link = footer.getByRole('link', { name: localization.apiDocKlass });
    await expect(link).toHaveAttribute('href', 'https://data.test.ssb.no/api/klass/swagger-ui/index.html');
  });

  test('Accessibility statement link points to the correct URL', async ({ page }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const footer = page.getByRole('contentinfo');
    const link = footer.getByRole('link', { name: localization.info.footerAccessibilityStatement });
    await expect(link).toHaveAttribute('href', ACCESSIBILITY_STATEMENT_URL);
  });

  test('Privacy statement link points to the correct URL', async ({ page }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const footer = page.getByRole('contentinfo');
    const link = footer.getByRole('link', { name: localization.info.footerPrivacyStatement });
    await expect(link).toHaveAttribute('href', PRIVACY_STATEMENT_URL);
  });

  test('Vardef API documentation link points to the internal test docs URL when authenticated', async ({
    page,
  }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    const footer = page.getByRole('contentinfo');
    const link = footer.getByRole('link', { name: localization.apiDocVardef });
    await expect(link).toHaveAttribute(
      'href',
      'https://metadata.test.ssb.no/docs/swagger/variable-definitions?urls.primaryName=internal',
    );
  });

  test('Klassifikasjoner API documentation link points to the correct URL when authenticated', async ({
    page,
  }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    const footer = page.getByRole('contentinfo');
    const link = footer.getByRole('link', { name: localization.apiDocKlass });
    await expect(link).toHaveAttribute('href', 'https://data.test.ssb.no/api/klass/swagger-ui/index.html');
  });
});
