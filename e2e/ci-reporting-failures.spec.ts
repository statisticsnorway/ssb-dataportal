import { expect, test } from '@bgotink/playwright-coverage';

/**
 * Temporary, intentionally failing tests for verifying that CI combines
 * failures from multiple Playwright shards into one final report.
 *
 * Remove this file after the CI reporting workflow has been verified.
 */
test.describe('CI failure report verification', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
  });

  test('landing page uses the expected updated heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Velkommen til SSBs dataportal');
  });

  test('variable definitions navigation uses the localized route', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Variabeldefinisjoner' })).toHaveAttribute(
      'href',
      '/variabeldefinisjoner',
    );
  });

  test('not-found page links to the dataportal support address', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    await expect(page.getByRole('link', { name: 'Meld fra om ødelagt lenke' })).toHaveAttribute(
      'href',
      /mailto:dataportal@ssb\.no/,
    );
  });
});
