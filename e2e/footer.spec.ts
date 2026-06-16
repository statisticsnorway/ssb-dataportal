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

  test('API documentation link is visible in the footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: localization.apiDocumentation })).toBeVisible();
  });

  test('Accessibility statement link is visible in the footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: localization.info.footerAccessibilityStatement })).toBeVisible();
  });

  test('API documentation link points to the test docs URL when not authenticated', async ({
    page,
  }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const link = page.getByRole('link', { name: localization.apiDocumentation });
    await expect(link).toHaveAttribute('href', 'https://metadata.test.ssb.no/docs/swagger/variable-definitions');
  });

  test('Accessibility statement link points to the correct URL', async ({ page }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const link = page.getByRole('link', { name: localization.info.footerAccessibilityStatement });
    await expect(link).toHaveAttribute('href', ACCESSIBILITY_STATEMENT_URL);
  });

  test('Privacy statement link points to the correct URL', async ({ page }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const link = page.getByRole('link', { name: localization.info.footerPrivacyStatement });
    await expect(link).toHaveAttribute('href', PRIVACY_STATEMENT_URL);
  });

  test('API documentation link points to the internal test docs URL when authenticated', async ({
    page,
  }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    const link = page.getByRole('link', { name: localization.apiDocumentation });
    await expect(link).toHaveAttribute(
      'href',
      'https://metadata.test.ssb.no/docs/swagger/variable-definitions?urls.primaryName=internal',
    );
  });
});
