import versionsMock from '@/static-data/versions.json';
import { formatVariantName } from '@/app/(details)/classifications/utils/variants';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { test, expect } from '@bgotink/playwright-coverage';

const versions = versionsMock.versions!;
const currentVersion = versions[0]!;
const olderVersion = versions[1]!;
const futureVersion = versions[2]!;

const variant = currentVersion.classificationVariants![0]!;
const futureVariant = futureVersion.classificationVariants![0]!;

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === 'chrome-unauth');
});

test.describe('Variant by id', () => {
  test('displays a variant from the current version', async ({ page }) => {
    const url = buildUrl({ classificationId: 2003, variantId: variant.id });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(url);
    await expect(page.getByRole('heading', { name: formatVariantName(variant.name) })).toBeVisible();
    await expect(page.getByText(String(variant.id), { exact: true })).toBeVisible();
  });

  test('shows the current variant when a future version exists', async ({ page }) => {
    expect(futureVersion.id).toBeDefined();
    expect(futureVariant).toBeDefined();

    const url = buildUrl({
      classificationId: 2003,
      variantId: variant.id,
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(url);
    await expect(page.getByRole('heading', { name: formatVariantName(variant.name) })).toBeVisible();
  });

  test('displays a variant from a future version', async ({ page }) => {
    const url = buildUrl({
      classificationId: 2003,
      versionId: futureVersion.id,
      variantId: futureVariant.id,
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(url);
    await expect(page.getByRole('heading', { name: formatVariantName(futureVariant.name) })).toBeVisible();
  });

  test('shows not-found state for an illegal variant id', async ({ page }) => {
    const url = buildUrl({ classificationId: 2003, variantId: 999999 });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Variant ikke funnet' })).toBeVisible();
  });

  test('shows not-found state for a variant in an older version', async ({ page }) => {
    const url = buildUrl({
      classificationId: 2003,
      versionId: olderVersion.id,
      variantId: variant.id,
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Variant ikke funnet' })).toBeVisible();
  });
});
