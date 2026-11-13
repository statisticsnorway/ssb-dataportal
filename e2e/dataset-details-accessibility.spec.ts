import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@bgotink/playwright-coverage';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';

const EXAMPLE_DATASET = `${tabsData.DataProducts.route}/arbstatus/datasets/id11`;

test.describe('Dataset details – accessibility', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
    await page.goto(EXAMPLE_DATASET);
  });

  test('Page follows wcag standard with filters expanded', async ({ page }) => {
    await page.getByRole('button', { name: localization.search.textFilter.label }).click();
    await page.getByRole('button', { name: localization.datasetDetail.period, exact: true }).click();
    const results = await new AxeBuilder({ page }).withTags(['wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Color contrasts are accessible with an active period filter', async ({ page }) => {
    await page.getByRole('button', { name: localization.datasetDetail.period, exact: true }).click();
    const thumb = page.getByRole('slider', {
      name: `${localization.datasetDetail.periodRange} ${localization.datasetDetail.periodTo}`,
    });
    await thumb.focus();
    await page.keyboard.press('Home');
    await expect(page.getByRole('button', { name: localization.datasetDetail.resetFilters })).toBeVisible();

    const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    expect(results.violations).toEqual([]);
  });
});
