import versionsMock from '@/static-data/versions.json';
import { isSupportedLanguage, localization } from '@/libs/language';
import { formatCustodian, formatLanguages, formatLocaleDate } from '@/utils/functions';
import { parseVersion } from '@/utils/mock-data';
import { Page } from '@playwright/test';
import { test, expect } from '@bgotink/playwright-coverage';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';

const versions = versionsMock.versions;
const currentVersion = versions![0];
const olderVersion = versions![1];

// add test data variants ?
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
  });

  test('displays variant info', async ({ page }) => {
    await gotoVariants(page, CURRENT_DETAILS_URL);
  });

  test('displays variants list', async ({ page }) => {
    await gotoVariants(page, CURRENT_DETAILS_URL);
  });
});
