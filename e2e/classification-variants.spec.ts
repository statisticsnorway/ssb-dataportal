import versionsMock from '@/static-data/versions.json';
import { localization } from '@/libs/language';
import { formatVariantName } from '@/app/(details)/classifications/utils/variants';
import { Page } from '@playwright/test';
import { test, expect } from '@bgotink/playwright-coverage';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';

const versions = versionsMock.versions;
const currentVersion = versions![0];
const olderVersion = versions![1];

const CURRENT_DETAILS_URL = '/classifications/2003/variants';
const OLDER_DETAILS_URL = `/classifications/2003/version/${olderVersion!.id ?? 2}/variants`;

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

  test('displays variants cards', async ({ page }) => {
    await gotoVariants(page, CURRENT_DETAILS_URL);
    await expect(page.getByRole('list')).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(currentVersion!.classificationVariants!.length);
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
