import { expect, test } from '@bgotink/playwright-coverage';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';
import { stabilize } from './utils/commonUtils';

test.use({ viewport: { width: 360, height: 740 } });

test.beforeEach(async ({}, testInfo) => {
  if (testInfo.project.name === 'chrome-unauth') testInfo.skip();
});

const expectNoHorizontalOverflow = async (page: import('@playwright/test').Page) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
};

const expectSelectedTabVisible = async (page: import('@playwright/test').Page) => {
  const tabList = page.getByRole('tablist');
  const selectedTab = tabList.getByRole('tab', { selected: true });
  await expect(selectedTab).toBeVisible();
  const [listBox, tabBox] = await Promise.all([tabList.boundingBox(), selectedTab.boundingBox()]);
  expect(tabBox!.x).toBeGreaterThanOrEqual(listBox!.x - 1);
  expect(tabBox!.x + tabBox!.width).toBeLessThanOrEqual(listBox!.x + listBox!.width + 1);
};

test.describe('mobile discovery', () => {
  for (const tab of Object.values(tabsData)) {
    test(`keeps the active tab visible without page overflow on ${tab.route}`, async ({ page }) => {
      await page.goto(tab.route);
      await stabilize();

      await expectSelectedTabVisible(page);
      await expectNoHorizontalOverflow(page);
    });
  }

  test('keeps the selected tab visible after switching category and resizing', async ({ page }) => {
    await page.goto(tabsData.VariableDefinitions.route);
    await stabilize();

    await page.getByRole('tab', { name: localization.tabs.dataProducts }).click();
    await page.waitForURL(`**${tabsData.DataProducts.route}**`);
    await expectSelectedTabVisible(page);

    await page.setViewportSize({ width: 320, height: 640 });
    await expectSelectedTabVisible(page);
    await expectNoHorizontalOverflow(page);
  });

  test('opens the filter sheet, shows the active filter count and clears filters', async ({ page }) => {
    await page.goto(`${tabsData.DataProducts.route}?q=a`);
    await stabilize();

    const filterButton = page.getByTestId('mobile-filter-button');
    await expect(filterButton).toContainText('(1)');

    await filterButton.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: localization.search.filter.label })).toBeVisible();

    await dialog.getByRole('button', { name: localization.button.removeFilter }).click();
    await expect(filterButton).not.toContainText('(');

    await dialog.getByRole('button', { name: localization.search.filter.showResults }).click();
    await expect(dialog).toBeHidden();
    await expectNoHorizontalOverflow(page);
  });
});
