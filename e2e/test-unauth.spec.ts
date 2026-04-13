import { localization } from '@/libs/language';
import test, { expect } from '@playwright/test';

test('Unauthenticated page test', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chrome-unauth');

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(localization.info.landingPageTitle);
});
