import { localization } from '@/libs/language';
import { test, expect } from '@bgotink/playwright-coverage';
import { stabilize } from './utils/commonUtils';

test.describe('authenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.project.name === 'chrome-unauth') testInfo.skip();
  });

  test('Data products can be sorted by naming standard violations', async ({ page }) => {
    await page.goto('/data-products/ameld');
    await stabilize();

    const main = page.getByRole('main');

    await main.getByRole('combobox', { name: localization.search.sort.label }).selectOption('violationsDesc');

    await expect(main.getByRole('paragraph')).toContainText('2 treff');
  });

  test('Data product datasets can be filtered by assessment', async ({ page }) => {
    await page.goto('/data-products/arbstatus');
    await stabilize();

    const main = page.getByRole('main');
    const protectedFilter = main.getByRole('checkbox', { name: localization.products.assessment.protected });
    const openFilter = main.getByRole('checkbox', { name: localization.products.assessment.open });
    const sensitiveFilter = main.getByRole('checkbox', { name: localization.products.assessment.sensitive });

    await protectedFilter.check();
    const heading1 = page.getByRole('heading', { name: 'Arbeidsstatus datasett 1' });
    const heading2 = page.getByRole('heading', { name: 'Arbeidsstatus datasett 2' });
    const heading3 = page.getByRole('heading', { name: 'Arbeidsstatus datasett 3' });
    await expect(heading2).toBeVisible();
    await expect(heading1).not.toBeVisible();
    await expect(heading3).not.toBeVisible();

    await openFilter.check();
    await expect(heading1).toBeVisible();

    await protectedFilter.uncheck();
    await expect(heading2).not.toBeVisible();

    await sensitiveFilter.check();
    await expect(heading3).toBeVisible();
  });
  test('Data product datasets can be filtered by storage category', async ({ page }) => {
    await page.goto('/data-products/arbstatus');
    await stabilize();

    await expect(page).toHaveURL(/\/data-products\/arbstatus/);
    await expect(page.getByRole('main')).toBeVisible();

    const productFilter = page.getByRole('checkbox', { name: localization.products.storageCategory.product });
    const sharedFilter = page.getByRole('checkbox', { name: localization.products.storageCategory.shared });

    await productFilter.check();
    const heading1 = page.getByRole('heading', { name: 'Arbeidsstatus datasett 3' });
    const heading2 = page.getByRole('heading', { name: 'Arbeidsstatus datasett 4' });

    await expect(heading1).toBeVisible();
    await expect(heading2).not.toBeVisible();
    await productFilter.uncheck();
    await sharedFilter.check();
    await expect(heading2).toBeVisible();
    await expect(heading1).not.toBeVisible();
  });
});

test.describe('unauthenticated', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.project.name !== 'chrome-unauth') testInfo.skip();
  });

  test('Display alert if no shared datasets', async ({ page }) => {
    await page.goto('/data-products/ameld');
    await stabilize();

    const main = page.getByRole('main');
    const alert = main.getByRole('status');
    await expect(alert).toBeVisible();
  });

  test('Filtered by storage category is not visible when unauthenticated', async ({ page }) => {
    await page.goto('/data-products/arbstatus');
    await stabilize();

    const main = page.getByRole('main');

    await expect(
      main.getByRole('checkbox', {
        name: localization.products.assessment.protected,
      }),
    ).toBeVisible();

    await expect(
      main.getByRole('checkbox', {
        name: localization.products.assessment.open,
      }),
    ).toBeVisible();

    await expect(
      main.getByRole('checkbox', {
        name: localization.products.assessment.sensitive,
      }),
    ).toBeVisible();

    await expect(
      main.getByRole('checkbox', {
        name: localization.products.storageCategory.product,
      }),
    ).toHaveCount(0);

    await expect(
      main.getByRole('checkbox', {
        name: localization.products.storageCategory.shared,
      }),
    ).toHaveCount(0);
  });
});
