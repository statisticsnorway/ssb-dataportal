import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@bgotink/playwright-coverage';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';

const route = tabsData.DataProducts.route;

test.describe('Timeline accessibility', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
  });

  test('mobile opens file cards directly, grouped by period', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`${route}/ameld/datasets/id11`);
    const timeline = page.getByTestId('data-coverage-timeline');
    const year = timeline.getByRole('button', {
      name: localization.dataCoverageTimeline.showYear.replace('{year}', '2017'),
    });
    await year.focus();
    await page.keyboard.press('Enter');
    await expect(timeline.getByRole('heading', { name: 'H1 2017', exact: true })).toBeVisible();
    await expect(timeline.getByRole('heading', { name: 'H2 2017', exact: true })).toBeVisible();
    await expect(timeline.getByRole('article')).toHaveCount(2);
    await expect(timeline.getByText('ameld_p2017-H1.parquet', { exact: true })).toHaveCount(0);
    const results = await new AxeBuilder({ page })
      .include('[data-testid="data-coverage-timeline"]')
      .withRules(['button-name', 'color-contrast', 'target-size', 'aria-valid-attr-value'])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test('long timelines collapse on mobile and empty years explain their state', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`${route}/arblonn/datasets/id13`);
    const timeline = page.getByTestId('data-coverage-timeline');
    await expect(timeline.getByRole('button', { name: /2023/ })).toHaveCount(0);
    await timeline.getByRole('button', { name: localization.datasetDetail.showAllTimelinePeriods }).first().click();
    const emptyYear = timeline.getByRole('button', {
      name: localization.dataCoverageTimeline.showYear.replace('{year}', '2011'),
    });
    await emptyYear.click();
    await expect(timeline.getByText(localization.dataCoverageTimeline.noYearData)).toBeVisible();
    await timeline.getByRole('button', { name: localization.datasetDetail.showFewerTimelinePeriods }).click();
    await expect(timeline.getByRole('button', { name: /2011/ })).toHaveCount(0);
  });

  test('desktop keeps period popovers and switches to mobile rows on resize', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto(`${route}/ameld/datasets/id11`);
    const timeline = page.getByTestId('data-coverage-timeline');
    const period = timeline.getByRole('button', {
      name: new RegExp(`${localization.dataCoverageTimeline.tooltipStatusDataPresent}.*H1 2017`),
    });
    await period.click();
    await expect(timeline.getByRole('article')).not.toHaveCount(0);
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 320, height: 900 });
    await expect(
      timeline.getByRole('button', { name: localization.dataCoverageTimeline.showYear.replace('{year}', '2017') }),
    ).toBeVisible();
    await expect(period).toHaveCount(0);
  });
});
