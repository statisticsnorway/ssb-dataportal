import { expect, test, TestInfo } from '@playwright/test';
import { localization } from '@/libs/language';
import { stabilize } from './utils/commonUtils';

test.describe('footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await stabilize();
  });

  test('API documentation link is visible in the footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: localization.apiDocumentation })).toBeVisible();
  });

  test('API documentation link points to the test docs URL when not authenticated', async ({
    page,
  }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
    const link = page.getByRole('link', { name: localization.apiDocumentation });
    await expect(link).toHaveAttribute('href', 'https://metadata.test.ssb.no/docs/swagger/variable-definitions');
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
