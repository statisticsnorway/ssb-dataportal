import { expect, test } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';

test('Classifications page', async ({ page }) => {
  await page.goto(tabsData.Classifications.route);
  await expect(page).toHaveURL(tabsData.Classifications.route);
});
