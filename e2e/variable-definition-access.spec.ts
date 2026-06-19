import { test, expect } from '@bgotink/playwright-coverage';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language/src/localization';

const route = tabsData.VariableDefinitions.route;
const DRAFT_URL = `${route}/aksje`;
const INTERNAL_URL = `${route}/sp27_1`;
const EXTERNAL_URL = `${route}/org_form`;

const NOT_FOUND_HEADING = 'Variabeldefinisjon ikke funnet';

test.describe('unauthenticated access control', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chrome-unauth');
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
    await expect(page.getByRole('navigation', { name: localization.breadcrumbsLabel })).toBeVisible();
  });
});

test.describe('authenticated access control', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.project.name === 'chrome-unauth') testInfo.skip();
  });

  test('allows DRAFT variable', async ({ page }) => {
    await page.goto(DRAFT_URL);
    await expect(page.getByRole('navigation', { name: localization.breadcrumbsLabel })).toBeVisible();
  });

  test('allows PUBLISHED_INTERNAL variable', async ({ page }) => {
    await page.goto(INTERNAL_URL);
    await expect(page.getByRole('navigation', { name: localization.breadcrumbsLabel })).toBeVisible();
  });

  test('allows PUBLISHED_EXTERNAL variable', async ({ page }) => {
    await page.goto(EXTERNAL_URL);
    await expect(page.getByRole('navigation', { name: localization.breadcrumbsLabel })).toBeVisible();
  });
});
