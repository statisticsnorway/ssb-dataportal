import { test, expect } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';

const route = tabsData.VariableDefinitions.route;
const DRAFT_URL = `${route}/aksje`;
const INTERNAL_URL = `${route}/sp27_1`;
const EXTERNAL_URL = `${route}/org_form`;

const NOT_FOUND_HEADING = 'Variabeldefinisjon ikke funnet';

test.describe('unauthenticated access control', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.project.name !== 'chrome-unauth') testInfo.skip();
  });

  test('blocks DRAFT variable', async ({ page }) => {
    await page.goto(DRAFT_URL);
    await expect(page.getByRole('heading', { name: NOT_FOUND_HEADING })).toBeVisible();
  });

  test('blocks PUBLISHED_INTERNAL variable', async ({ page }) => {
    await page.goto(INTERNAL_URL);
    await expect(page.getByRole('heading', { name: NOT_FOUND_HEADING })).toBeVisible();
  });

  test('allows PUBLISHED_EXTERNAL variable', async ({ page }) => {
    await page.goto(EXTERNAL_URL);
    await expect(page.getByTestId('vardefBreadcrumbs')).toBeVisible();
  });
});

test.describe('authenticated access control', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.project.name === 'chrome-unauth') testInfo.skip();
  });

  test('allows DRAFT variable', async ({ page }) => {
    await page.goto(DRAFT_URL);
    await expect(page.getByTestId('vardefBreadcrumbs')).toBeVisible();
  });

  test('allows PUBLISHED_INTERNAL variable', async ({ page }) => {
    await page.goto(INTERNAL_URL);
    await expect(page.getByTestId('vardefBreadcrumbs')).toBeVisible();
  });

  test('allows PUBLISHED_EXTERNAL variable', async ({ page }) => {
    await page.goto(EXTERNAL_URL);
    await expect(page.getByTestId('vardefBreadcrumbs')).toBeVisible();
  });
});
