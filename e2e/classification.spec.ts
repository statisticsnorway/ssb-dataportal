import { test as base, expect } from '@bgotink/playwright-coverage';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import classificationMock from '@/static-data/classifications.json';
import { parseClassification } from '@/utils/classifications/classificationHelpers';

type ClassificationPageFixture = (classification: ClassificationResource) => Promise<void>;
const classifications = classificationMock.classifications;

const goToClassification = async (page: import('@playwright/test').Page, classification: ClassificationResource) => {
  await page.goto('/classifications');

  // Wait for the classification link to be visible before clicking
  const link = page.getByRole('link', { name: classification.name });
  await expect(link).toBeVisible({ timeout: 5000 });

  await Promise.all([page.waitForURL(new RegExp(`/classifications/${classification.id}`)), link.click()]);
};

const test = base.extend<{
  goToClassification: ClassificationPageFixture;
}>({
  goToClassification: async ({ page }, applyFixture) => {
    await applyFixture((classification: ClassificationResource) => goToClassification(page, classification));
  },
});

test.skip('Navigate to up to 4 classifications', async ({ goToClassification, page }) => {
  const validClassifications = classifications.slice(0, 4);

  if (validClassifications.length === 0) {
    test.skip();
    return;
  }

  for (const classification of validClassifications) {
    // Go to the classification
    const parsedClassification = parseClassification(classification);
    await goToClassification(parsedClassification);

    // Return to classifications page safely
    const homeLink = page.getByRole('link', { name: localization.navigateHomeClassifications });
    await expect(homeLink).toBeVisible({ timeout: 10000 });

    await Promise.all([page.waitForURL('/classifications'), homeLink.click()]);

    // Wait for classifications page to be ready for next iteration
    await expect(page.getByRole('tab', { name: localization.tabs.classifications })).toBeVisible({ timeout: 5000 });
  }
});
