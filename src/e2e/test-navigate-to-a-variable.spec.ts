import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/variable-definitions');
  await page.getByRole('link', { name: 'Kommunenummer' }).dblclick();
  await page.getByText('KommunenummerID -0O1QLezwSist').click();
  await expect(page).toHaveURL(/\/variable-definitions\/0O1QLezw/);
  await expect(page.getByRole('heading', { name: 'Kommunenummer' })).toBeVisible();
});