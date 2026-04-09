import { localization } from '@/libs/language';
import { expect, test } from './fixtures/landingPage.fixture';

test.describe('Landing page', () => {
  test('Heading one', async ({ landingPage }) => {
    await expect(landingPage.getByRole('heading', { level: 1 })).toContainText(localization.info.landingPageTitle);
    await expect(landingPage.getByRole('heading', { level: 1 })).toMatchAriaSnapshot(
      `- heading "${localization.info.landingPageTitle}" [level=1]`,
    );
  });

  test('Details', async ({ landingPage }) => {
    const introSummary = landingPage.getByText(localization.info.landingPageInfoIntroTitle, { exact: true });
    const introContent = landingPage.getByText(localization.info.landingPageInfoIntro, { exact: true });

    await expect(introSummary).toBeVisible();
    await introSummary.click();
    await expect(introContent).toBeVisible();
    await introSummary.click();

    const goalSummary = landingPage.getByText(localization.info.landingPageInfoGoalTitle, { exact: true });
    const goalContent = landingPage.getByText(localization.info.landingPageInfoGoal, { exact: true });

    await expect(goalSummary).toBeVisible();
    await goalSummary.click();
    await expect(goalContent).toBeVisible();
    await goalSummary.click();

    const prototypeSummary = landingPage.getByText(localization.info.landingPagePrototypeTitle, { exact: true });
    const prototypeContent = landingPage.getByText(localization.info.landingPageInfoPrototype, { exact: true });

    await expect(prototypeSummary).toBeVisible();
    await prototypeSummary.click();
    await expect(prototypeContent).toBeVisible();
  });

  test('Navigate from landingpage to variable definitions', async ({ landingPage }) => {
    await expect(landingPage.getByRole('heading', { level: 1 })).toContainText(localization.info.landingPageTitle);
    await landingPage.getByRole('link', { name: localization.tabs.variableDefinitions }).click();
    await expect(landingPage.getByRole('tab', { name: localization.tabs.variableDefinitions })).toBeVisible();
    await expect(landingPage.getByRole('tab', { name: localization.tabs.variableDefinitions })).toContainText(
      localization.tabs.variableDefinitions,
    );
    const linkHome = landingPage.getByRole('link', { name: localization.statisticsNorway });
    await linkHome.click();
    await expect(landingPage).toHaveURL(/\/$/);
    await expect(landingPage.getByRole('heading', { level: 1 })).toContainText(localization.info.landingPageTitle);
  });
});
