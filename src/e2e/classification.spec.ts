import { test as base, expect } from '@playwright/test';
import { localization } from '@/libs/language';
import { Classification } from '@/types/classification';
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

      await page.getByRole('link', { name: classification.name }).click();
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

    // Return to classifications
    await page.getByRole('link', { name: localization.navigateHomeClassifications }).click();
    await expect(page).toHaveURL(/\/classifications$/);
  }
});
