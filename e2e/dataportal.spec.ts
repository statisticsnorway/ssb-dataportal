import { expect, test } from '@playwright/test';
import { localization } from '@/libs/language';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('Heading one', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(localization.info.landingPageTitle);
    await expect(page.getByRole('heading', { level: 1 })).toMatchAriaSnapshot(
      `- heading "${localization.info.landingPageTitle}" [level=1]`,
    );
  });

  test('Details', async ({ page }) => {
    const details = page.locator('.ds-details');

    const introSummary = details.locator('summary', { hasText: localization.info.landingPageInfoIntroTitle });
    const introContent = details.locator('div', { hasText: localization.info.landingPageInfoIntro });

    await introSummary.click();
    await expect(introContent).toBeVisible();
    await introSummary.click(); // collapse

    const goalSummary = details.locator('summary', { hasText: localization.info.landingPageInfoGoalTitle });
    const goalContent = details.locator('div', { hasText: localization.info.landingPageInfoGoal });

    await goalSummary.click();
    await expect(goalContent).toBeVisible();
    await goalSummary.click(); // collapse

    const prototypeSummary = details.locator('summary', { hasText: localization.info.landingPagePrototypeTitle });
    const prototypeContent = details.locator('div', { hasText: localization.info.landingPageInfoPrototype });

    await prototypeSummary.click();
    await expect(prototypeContent).toBeVisible();
  });

  test('Navigate from landingpage to variable definitions', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(localization.info.landingPageTitle);
    await page.getByRole('link', { name: localization.tabs.variableDefinitions }).click();
    await expect(page.getByRole('tab', { name: localization.tabs.variableDefinitions })).toBeVisible();
    await expect(page.getByRole('tab', { name: localization.tabs.variableDefinitions })).toContainText(
      localization.tabs.variableDefinitions,
    );
    await page.getByRole('link', { name: localization.statisticsNorway }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(localization.info.landingPageTitle);
  });
});
