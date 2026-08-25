import { expect, test } from '@bgotink/playwright-coverage';
import { localization } from '@/libs/language';
import { stabilize } from './utils/commonUtils';

// Temporary CI reporting probe.
// Delete this entire file after verifying the consolidated e2e result handling.
test.describe('TEMPORARY intentional failures for CI reporting', () => {
  test('INTENTIONAL FAILURE 1 - homepage footer link', async ({ page }) => {
    await page.goto('/');
    await stabilize();

    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: localization.apiDocKlass })).toHaveAttribute(
      'href',
      '/temporary-reporting-probe',
    );
  });

  test('INTENTIONAL FAILURE 2 - variable definitions search', async ({ page }) => {
    await page.goto('/variable-definitions');
    await stabilize();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Temporary reporting probe');
  });

  test('INTENTIONAL FAILURE 3 - classifications list', async ({ page }) => {
    await page.goto('/classifications');
    await stabilize();

    await expect(page.getByRole('article').first()).toHaveAccessibleName('Temporary classification');
  });

  test('INTENTIONAL FAILURE 4 - site language', async ({ page }) => {
    await page.goto('/');
    await stabilize();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  });
});
