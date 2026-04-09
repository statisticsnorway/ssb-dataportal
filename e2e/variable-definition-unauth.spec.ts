import { test, expect } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';

const KNOWN_SHORT_NAME = 'aksje';
const DETAIL_URL = `${tabsData.VariableDefinitions.route}/${KNOWN_SHORT_NAME}`;
test.describe('unauthenticated view', () => {
  test('hides Python code snippet', async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByTestId('code-snippet')).not.toBeAttached();
  });

  test('hides Owner panel', async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByRole('heading', { name: localization.owner.label })).not.toBeAttached();
  });

  test('hides StatusTag in sidebar', async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.locator('aside').getByText(localization.status.draft)).not.toBeAttached();
  });

  test('shows only "Updated on", hides three auth-only audit fields', async ({ page }) => {
    await page.goto(DETAIL_URL);
    const sidebar = page.locator('aside');
    await expect(sidebar.getByText(`${localization.editing.updated} ${localization.on}`)).toBeVisible();
    await expect(sidebar.getByText(`${localization.editing.updated} ${localization.by}`)).not.toBeAttached();
    await expect(sidebar.getByText(`${localization.editing.created} ${localization.on}`)).not.toBeAttached();
    await expect(sidebar.getByText(`${localization.editing.created} ${localization.by}`)).not.toBeAttached();
  });

  test('public content still visible', async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByTestId('vardefBreadcrumbs')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
