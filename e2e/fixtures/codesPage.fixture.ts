import type { Page, TestInfo } from '@playwright/test';
import { test as base, expect } from '@bgotink/playwright-coverage';
import { CODES_URL, CODES_VERSION_URL, stabilize } from '../utils/commonUtils';

async function waitForCodeTreeHydration(page: Page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const firstChevron = page.getByRole('tree').locator('button[aria-expanded]').first();
    await expect(firstChevron).toBeVisible();
    try {
      await expect
        .poll(
          async () => {
            if ((await firstChevron.getAttribute('aria-expanded')) !== 'true') {
              await firstChevron.click();
            }
            return firstChevron.getAttribute('aria-expanded');
          },
          { timeout: 5_000 },
        )
        .toBe('true');
      await firstChevron.click();
      await expect(firstChevron).toHaveAttribute('aria-expanded', 'false');
      return;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
      await page.reload({ waitUntil: 'networkidle' });
    }
  }
}

export const test = base.extend<{
  codesPage: Page;
  codesVersionPage: Page;
}>({
  codesPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(CODES_URL);
    await expect(page).toHaveURL(new RegExp(CODES_URL));
    await waitForCodeTreeHydration(page);
    await use(page);
  },

  codesVersionPage: async ({ page }, use, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(CODES_VERSION_URL);
    await expect(page).toHaveURL(new RegExp(CODES_VERSION_URL));
    await waitForCodeTreeHydration(page);
    await use(page);
  },
});

export { expect };
