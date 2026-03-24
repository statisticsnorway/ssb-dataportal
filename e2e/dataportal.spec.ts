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
    const introSummary = page.getByText(localization.info.landingPageInfoIntroTitle, { exact: true });
    const introContent = page.getByText(localization.info.landingPageInfoIntro, { exact: true });

    await expect(introSummary).toBeVisible();
    await introSummary.click();
    await expect(introContent).toBeVisible();
    await introSummary.click();

    const goalSummary = page.getByText(localization.info.landingPageInfoGoalTitle, { exact: true });
    const goalContent = page.getByText(localization.info.landingPageInfoGoal, { exact: true });

    await expect(goalSummary).toBeVisible();
    await goalSummary.click();
    await expect(goalContent).toBeVisible();
    await goalSummary.click();

    const prototypeSummary = page.getByText(localization.info.landingPagePrototypeTitle, { exact: true });
    const prototypeContent = page.getByText(localization.info.landingPageInfoPrototype, { exact: true });

    await expect(prototypeSummary).toBeVisible();
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
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(localization.info.landingPageTitle);
  });
});
