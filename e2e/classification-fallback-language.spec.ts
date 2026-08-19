import versionsMock from '@/static-data/versions.json';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';
import { switchLanguage } from './utils/commonUtils';
import { formatCustodian, formatLocaleDate } from '@/utils/functions';
import { parseClassification, parseVersion } from '@/utils/mock-data';
import { Page } from '@playwright/test';
import { expect, test } from './fixtures/classification.fixture';
import classificationMock from '@/static-data/classifications.json';
import { formatVariantName } from '@/app/(details)/classifications/utils/variants';

const classifications = classificationMock.classifications;
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

async function assertDetailsList(page: Page, version: (typeof versions)[number]) {
  const dds = page.locator('dl dd');
  const manager = dds.getByText(formatCustodian(parseVersion(version)), { exact: true });
  await expect(manager).toBeVisible();
  await expect(manager).toHaveAttribute('lang', 'nb');
  const emailDd = dds.filter({ hasText: version.contactPerson!.email! });
  await expect(emailDd).toBeVisible();
  await expect(emailDd).toHaveAttribute('lang', 'nb');
  const validity = dds.getByText(formatLocaleDate(version.validFrom!), { exact: true });
  await expect(validity).toBeVisible();
  await expect(validity).toHaveAttribute('lang', 'nb');
  const publishedLanguages = dds.filter({
    hasText: 'Norwegian (Bokmål), Norwegian (Nynorsk)',
  });
  await expect(publishedLanguages).toBeVisible();
  await expect(publishedLanguages).not.toHaveAttribute('lang', 'nb');
  const noData = dds.getByText('Not relevant', { exact: true });
  for (let i = 0; i < (await noData.count()); i++) {
    await expect(noData.nth(i)).toBeVisible();
    await expect(noData.nth(i)).not.toHaveAttribute('lang', 'nb');
  }
}

test.describe('Classifications displays fallback language', () => {
  test('fallback language display tag with fallback language set', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[0]);
    const page = await classificationDetailsPage(classification.id!);
    await switchLanguage(page, 'English');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: classification.name! })).toHaveAttribute('lang', 'nb');
    const tag = page.locator('span.ds-tag', { hasText: 'Norwegian (Bokmål)' });
    await expect(tag).toBeVisible();
    await tag.hover();
    await expect(
      page.getByText('This classification is not available in the selected language', { exact: true }),
    ).toBeVisible();
  });

  test('displays fallback-language tag when classification is missing in the selected language', async ({
    classificationDetailsPage,
  }) => {
    const classification = parseClassification(classifications[0]);
    const page = await classificationDetailsPage(classification.id!);

    await switchLanguage(page, 'English');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: classification.name! })).toHaveAttribute('lang', 'nb');

    const tag = page.locator('span.ds-tag', { hasText: 'Norwegian (Bokmål)' });
    await expect(tag).toBeVisible();

    await tag.hover();
    await expect(
      page.getByText('This classification is not available in the selected language', { exact: true }),
    ).toBeVisible();
  });
});

test.describe('Correct language is set in html', () => {
  test('correct html lang fallback language current details', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage('2003');
    await page.goto(
      buildUrl({
        classificationId: 2003,
        tab: classificationDetailsTabsData.Details.slug,
      }),
    );
    await expect(page.locator('dl').first()).toBeVisible();

    await switchLanguage(page, 'English');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await assertDetailsList(page, currentVersion!);
  });

  test('correct html lang fallback language older details', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage('2003');
    await page.goto(
      buildUrl({
        classificationId: 2003,
        versionId: olderVersion!.id,
        tab: classificationDetailsTabsData.Details.slug,
      }),
    );
    await switchLanguage(page, 'English');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await assertDetailsList(page, olderVersion!);
  });
});

test('displays fallback-language tag when variants are missing in the selected language', async ({
  classificationDetailsPage,
}) => {
  const page = await classificationDetailsPage('2003');

  await page.goto(
    buildUrl({
      classificationId: 2003,
      versionId: currentVersion!.id,
      tab: classificationDetailsTabsData.Variants.slug,
    }),
  );
  await switchLanguage(page, 'English');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const variant = currentVersion!.classificationVariants![0]!;
  await page.getByRole('link', { name: formatVariantName(variant.name) }).click();
});

// check one variant
// current
// prev version
// check all variants language
// card
// test fallback language
