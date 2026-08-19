import versionsMock from '@/static-data/versions.json';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';
import { switchLanguage } from './utils/commonUtils';
import { formatCustodian, formatLocaleDate } from '@/utils/functions';
import { parseVersion } from '@/utils/mock-data';
import { Page } from '@playwright/test';
import { expect, test } from './fixtures/classification.fixture';

const versions = versionsMock.versions;

const currentVersion = versions![0];
const olderVersion = versions![1];

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
  for (let i = 0; i < await noData.count(); i++) {
    await expect(noData.nth(i)).toBeVisible();
    await expect(noData.nth(i)).not.toHaveAttribute('lang', 'nb');
  }
}

test('correct html lang fallback language current', async ({ classificationDetailsPage }) => {
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

test('correct html lang fallback language older', async ({ classificationDetailsPage }) => {
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
