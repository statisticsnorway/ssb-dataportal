import versionsMock from '@/static-data/versions.json';
import { localization } from '@/libs/language';
import { formatVariantName } from '@/app/(details)/classifications/utils/variants';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { Page } from '@playwright/test';
import { test, expect } from '@bgotink/playwright-coverage';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';

const versions = versionsMock.versions;
const currentVersion = versions![0];
const olderVersion = versions![1];

const CURRENT_DETAILS_URL = buildUrl({ classificationId: 2003, tab: 'variants' });
const OLDER_DETAILS_URL = buildUrl({ classificationId: 2003, versionId: olderVersion!.id ?? 2, tab: 'variants' });
const EXPLICIT_CURRENT_VERSION_URL = buildUrl({
  classificationId: 2003,
  versionId: currentVersion!.id,
  tab: 'variants',
});

async function gotoVariants(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const variantsTab = page.getByRole('tab', { name: classificationDetailsTabsData.Variants.label });
  await expect(variantsTab).toHaveAttribute('aria-selected', 'true');
  return page.getByLabel(localization.classification.variant.variantHeading);
}

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === 'chrome-unauth');
});

test.describe('Current variants tab', () => {
  test('displays variant heading', async ({ page }) => {
    await gotoVariants(page, CURRENT_DETAILS_URL);
    await expect(page.getByRole('heading', { name: localization.classification.variant.variantHeading })).toBeVisible();
  });

  test('displays variant info', async ({ page }) => {
    await gotoVariants(page, CURRENT_DETAILS_URL);
    await expect(page.getByText(localization.classification.variant.variantInfo)).toBeVisible();
  });

  test('each card displays id and owner', async ({ page }) => {
    await gotoVariants(page, CURRENT_DETAILS_URL);

    for (const variant of currentVersion!.classificationVariants!) {
      const heading = page.getByRole('heading', { name: formatVariantName(variant.name) });
      await expect(heading).toBeVisible();
      const card = heading.locator('xpath=following-sibling::dl[1]');

      await expect(card.getByText(String(variant.id), { exact: true })).toBeVisible();
      if (variant.owningSection) {
        await expect(card.getByText(variant.owningSection, { exact: true })).toBeVisible();
      }
    }
  });

  test('keeps the shared tabs mounted when opening and closing a variant', async ({ page }) => {
    await gotoVariants(page, CURRENT_DETAILS_URL);

    const tabList = page.getByRole('tablist');
    await tabList.evaluate((element) => element.setAttribute('data-mount-check', 'mounted'));

    const variant = currentVersion!.classificationVariants![0]!;
    await page.getByRole('link', { name: formatVariantName(variant.name) }).click();

    await expect(page).toHaveURL(buildUrl({ classificationId: 2003, variantId: variant.id }));
    await expect(page.getByRole('tab', { name: classificationDetailsTabsData.Variants.label })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('[data-mount-check="mounted"]')).toBeVisible();

    await page.getByRole('link', { name: localization.codeTree.back, exact: true }).click();

    await expect(page).toHaveURL(CURRENT_DETAILS_URL);
    await expect(page.locator('[data-mount-check="mounted"]')).toBeVisible();
  });
});

test.describe('Older variants tab', () => {
  test('displays variant heading', async ({ page }) => {
    await gotoVariants(page, OLDER_DETAILS_URL);
    await expect(page.getByRole('heading', { name: localization.classification.variant.variantHeading })).toBeVisible();
  });

  test('displays variant info', async ({ page }) => {
    await gotoVariants(page, OLDER_DETAILS_URL);
    await expect(page.getByText(localization.classification.variant.variantInfo)).toBeVisible();
  });

  test('displays no variants alert', async ({ page }) => {
    await gotoVariants(page, OLDER_DETAILS_URL);
    await expect(
      page.getByRole('status').filter({ hasText: localization.classification.variant.noVariants }),
    ).toBeVisible();
  });
});

test.describe('Explicit version variants tab', () => {
  test('keeps the version in the URL when opening and closing a variant', async ({ page }) => {
    await gotoVariants(page, EXPLICIT_CURRENT_VERSION_URL);

    const variant = currentVersion!.classificationVariants![0]!;
    await page.getByRole('link', { name: formatVariantName(variant.name) }).click();

    await expect(page).toHaveURL(
      buildUrl({ classificationId: 2003, versionId: currentVersion!.id, variantId: variant.id }),
    );
    await expect(page.getByRole('tab', { name: classificationDetailsTabsData.Variants.label })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await page.getByRole('link', { name: localization.codeTree.back, exact: true }).click();
    await expect(page).toHaveURL(EXPLICIT_CURRENT_VERSION_URL);
  });
});

test.describe('Variant not-found routes', () => {
  test('shows not-found state for an unknown latest-version variant', async ({ page }) => {
    await page.goto(buildUrl({ classificationId: 2003, variantId: 999999 }));

    await expect(page.getByRole('heading', { name: 'Variant ikke funnet' })).toBeVisible();
    const notFoundState = page.locator('section[aria-labelledby="app-not-found-title"]');
    await expect(notFoundState.getByRole('link', { name: 'Klassifikasjoner' })).toHaveAttribute('href', buildUrl({}));
    await expect(notFoundState.getByRole('link', { name: 'Varianter' })).toHaveAttribute(
      'href',
      buildUrl({ classificationId: 2003, tab: 'variants' }),
    );
  });

  test('shows not-found state for an unknown versioned variant', async ({ page }) => {
    await page.goto(buildUrl({ classificationId: 2003, versionId: 2, variantId: 999999 }));

    await expect(page.getByRole('heading', { name: 'Variant ikke funnet' })).toBeVisible();
    const notFoundState = page.locator('section[aria-labelledby="app-not-found-title"]');
    await expect(notFoundState.getByRole('link', { name: 'Klassifikasjoner' })).toHaveAttribute('href', buildUrl({}));
    await expect(notFoundState.getByRole('link', { name: 'Varianter' })).toHaveAttribute(
      'href',
      buildUrl({ classificationId: 2003, versionId: 2, tab: 'variants' }),
    );
  });
});

