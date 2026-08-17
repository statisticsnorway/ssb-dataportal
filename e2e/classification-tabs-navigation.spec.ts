import { expect, test } from './fixtures/classification.fixture';
import classificationsMock from '@/static-data/classifications.json';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';
import { parseClassification } from '@/utils/mock-data';
import { Page } from '@playwright/test';

const classifications = classificationsMock.classifications;

async function navigateAndAssertTabs(page: Page, baseUrl: string, tabs: Array<{ label: string; slug: string }>) {
  for (const { label, slug } of tabs) {
    const tab = page.getByRole('tab', { name: label });
    await expect(tab).toBeVisible();
    await tab.scrollIntoViewIfNeeded();

    await expect(async () => {
      await tab.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(`${baseUrl}/${slug}`, { timeout: 3000 });
      await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 });
    }).toPass({ timeout: 15_000 });
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
  const versionId = 2;
  const baseUrl = `/classifications/${classification.id}/version/${versionId}`;
  await page.goto(baseUrl);
  await expect(page).toHaveURL(`${baseUrl}/codes`);
});

test('Can navigate between tabs - latest version', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  const baseUrl = `/classifications/${classification.id}`;
  await page.waitForURL(`${baseUrl}/codes`);
  await navigateAndAssertTabs(page, baseUrl, Object.values(classificationDetailsTabsData));
});

test('Can navigate between tabs - specific version', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const versionId = 2;
  const page = await classificationDetailsPage(classification.id!);
  const baseUrl = `/classifications/${classification.id}/version/${versionId}`;
  await page.goto(baseUrl);
  await page.waitForURL(`${baseUrl}/codes`);
  await navigateAndAssertTabs(page, baseUrl, Object.values(classificationDetailsTabsData));
});
