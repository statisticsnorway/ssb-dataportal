import { expect, test } from '@playwright/test';

// This test should eventually test primarly what user can see and interact with on the
// variable definitions overview page
test.describe('Navigation variable definitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/variable-definitions$/);
  });
});

// This test depends on current testdata subject fields
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

test('Variable Aksje has two subject areas', async ({ page }) => {
  await page.goto('/variable-definitions');
  await page.getByRole('checkbox', { name: 'Bank og finansmarked' }).check();
  await page.getByRole('checkbox', { name: 'Bedrifter, foretak og regnskap' }).check();
  await page.getByRole('checkbox', { name: 'Bank og finansmarked' }).uncheck();
  await page.getByLabel('Select sort').selectOption('titleDesc');
  await page.getByRole('button', { name: 'x', exact: true }).click();
});

test('test', async ({ page }) => {
  await page.goto('/variable-definitions');
  await page.getByRole('checkbox', { name: 'Bedrifter, foretak og regnskap' }).check();
  await expect(page.getByText('En eierandel i et selskap med')).toBeVisible();
  await page.getByRole('checkbox', { name: 'Bank og finansmarked' }).check();
  await expect(page.getByRole('main')).toContainText('En eierandel i et selskap med avgrenset ansvar.');
  await expect(page.getByText('Bank og finansmarkedBedrifter')).toBeVisible();
  await page.getByRole('listitem').filter({ hasText: 'Bank og finansmarked (1)x' }).getByRole('button').click();
  await expect(page.getByText('AksjeaksjeEn eierandel i et')).toBeVisible();
  await page.getByRole('button', { name: 'x', exact: true }).click();
});

test('test2', async ({ page }) => {
  await page.goto('http://localhost:3000/variable-definitions');
  await expect(page.getByText('treff')).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Bank og finansmarked' })).not.toBeChecked();
  await page.getByRole('checkbox', { name: 'Bank og finansmarked' }).check();
  await expect(page.getByRole('main')).toContainText('1 treff');
  await page.getByRole('checkbox', { name: 'Bedrifter, foretak og regnskap' }).check();
  await expect(page.getByText('Bank og finansmarked (1)x')).toBeVisible();
  await expect(page.getByText('Bedrifter, foretak og regnskap (20)x')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('20 treff');
  await expect(page.getByRole('main')).toContainText('Aksjeaksje');
  await page.getByRole('listitem').filter({ hasText: 'Bank og finansmarked (1)x' }).getByRole('button').click();
  await expect(page.getByText('Bedrifter, foretak og regnskap (20)x')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('20 treff');
  await expect(page.getByText('AksjeaksjeEn eierandel i et')).toBeVisible();
  await page.getByRole('button', { name: 'x', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('76 treff');
});

// Filter has one subject area
// Filter has two subject areas
// Test tags - add and remove
// num hits

// Sort test
test('test3', async ({ page }) => {
  await page.goto('http://localhost:3000/variable-definitions');
  await page.getByLabel('Select sort').selectOption('titleDesc');
  await expect(page.getByRole('main')).toContainText('Årslønn');
  await page.getByLabel('Select sort').selectOption('titleAsc');
  await expect(page.getByRole('main')).toContainText('Aksje');
  await page.getByLabel('Select sort').selectOption('lastChanged');
});

test('test4', async ({ page }) => {
  await page.goto('http://localhost:3000/variable-definitions');
  await page.getByLabel('Select sort').selectOption('lastChanged');
  await expect(
    page.getByText('Antall personer 18 år og over i husholdningenpers18plus_i_hushnrAntall personer'),
  ).toBeVisible();
});
