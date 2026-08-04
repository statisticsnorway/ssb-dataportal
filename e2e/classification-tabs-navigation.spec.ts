import { expect, test } from './fixtures/classification.fixture';
import classificationsMock from '@/static-data/classifications.json';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';
import { parseClassification } from '@/utils/mock-data';

const classifications = classificationsMock.classifications;

async function navigateAndAssertTabs(page: any, baseUrl: string) {
  for (const { label, slug } of Object.values(classificationDetailsTabsData)) {
    const tab = page.getByRole('tab', { name: label });
    await expect(tab).toBeVisible();
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(`${baseUrl}/${slug}`);
  }
}

test('Redirects to codes tab by default', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  const baseUrl = `/classifications/${classification.id}`;
  await expect(page).toHaveURL(`${baseUrl}/codes`);
});

test('Redirects to codes tab by default version', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  const versionId = 364;
  const baseUrl = `/classifications/${classification.id}/version/${versionId}`;
  await page.goto(baseUrl);
  await expect(page).toHaveURL(`${baseUrl}/codes`);
});

test('Can navigate between tabs - latest version', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  const baseUrl = `/classifications/${classification.id}`;
  await page.waitForURL(`${baseUrl}/codes`);
  await navigateAndAssertTabs(page, baseUrl);
});

test('Can navigate between tabs - specific version', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[2]);
  const versionId = 364;
  const page = await classificationDetailsPage(classification.id!);
  const baseUrl = `/classifications/${classification.id}/version/${versionId}`;
  await page.goto(baseUrl);
  await navigateAndAssertTabs(page, baseUrl);
});
