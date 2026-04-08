import { localization } from '@/libs/language';
import test, { expect } from '@playwright/test';

test('Unauthenticated page test', async ({ page }, testInfo) => {
  //testInfo.annotations.push({ type: 'allowUnauthChrome' });
  if (testInfo.project.name !== 'chrome-unauth') {
    testInfo.skip();
  }

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(localization.info.landingPageTitle);
});
