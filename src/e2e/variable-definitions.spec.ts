import { expect, test } from '@playwright/test';

// This test should eventually test primarly what user can see and interact with on the
// variable definitions overview page
test.describe('Navigation variable definitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/variable-definitions$/);
  });
});

// This test depends on current testdata
test('Filter by subject field', async ({ page }) => {
  await page.goto('/variable-definitions');
  await page.getByRole('checkbox', { name: 'Arbeid og lønn' }).check();
  await page.getByRole('checkbox', { name: 'Inntekt og forbruk' }).check();
  await page.getByRole('checkbox', { name: 'Sosiale forhold og' }).check();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Sosiale forhold og kriminalitet (2)x' })
    .getByRole('button')
    .click();
  await page.getByRole('listitem').filter({ hasText: 'Fjern alle filterex' }).getByRole('button').click();
});
