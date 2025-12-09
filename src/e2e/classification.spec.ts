import { test as base, expect } from '@playwright/test';
import { localization } from '@/libs/language';
import { Classification } from '@/types/classification';
import { KLASSIFIKASJONER } from '@/utils/constants';
import { parseClassification } from '@/utils/functions';
import classificationMock from '../static-data/classifications.json';

type ClassificationPageFixture = (classification: Classification) => Promise<void>;
const classifications = classificationMock.classifications;
const test = base.extend<{
  goToClassification: ClassificationPageFixture;
}>({
  goToClassification: async ({ page }, use) => {
    const goToClassification = async (classification: Classification) => {
      await page.goto('/classifications');

      // Wait for the classification link to be visible before clicking
      const link = page.getByRole('link', { name: classification.name });
      await expect(link).toBeVisible({ timeout: 5000 });
      await link.click();

      // Wait for classification page to load
      await expect(page).toHaveURL(new RegExp(`/classifications/${classification.id}`));
    };
    await use(goToClassification);
  },
});

test('Navigate to up to 4 classifications', async ({ goToClassification, page }) => {
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
    await expect(homeLink).toBeVisible({ timeout: 5000 });
    await homeLink.click();

    // Wait for classifications page to be ready for next iteration
    await expect(page.getByRole('tab', { name: KLASSIFIKASJONER })).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/classifications$/);
  }
});
