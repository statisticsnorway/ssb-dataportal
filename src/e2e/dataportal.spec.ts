import { expect, test } from '@playwright/test';
import { localization } from '@/libs/language';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('Heading one', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(localization.info.landingPageTitle);
    await expect(page.getByRole('heading', { level: 1 })).toMatchAriaSnapshot(
      `- heading "${localization.info.landingPageTitle}" [level=1]`,
    );
  });

  test('Details', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: localization.info.landingPageInfoIntroTitle }).click();
    await expect(page.getByRole('main')).toContainText(localization.info.landingPageInfoIntro);
    await page.getByRole('button', { name: localization.info.landingPageInfoIntroTitle }).click();
    await page.getByRole('button', { name: localization.info.landingPageInfoGoalTitle }).click();
    await expect(page.getByText(localization.info.landingPageInfoGoal)).toBeVisible();
    await page.getByRole('button', { name: localization.info.landingPageInfoGoalTitle }).click();
    await page.getByRole('button', { name: localization.info.landingPagePrototypeTitle }).click();
    await expect(page.getByRole('main')).toContainText(localization.info.landingPageInfoPrototype);
  });

  test('Navigate from landingpage to variable definitions', async ({ page }) => {
    await page.goto('/');
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
