import AxeBuilder from '@axe-core/playwright';
import { test as base, expect, Page } from '@playwright/test';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';
import variableDefinitions from '@/static-data/variable-definitions.json';
import { socialConditionsAndCrime, statusDraft, workAndPay } from './utils';

export const test = base.extend<{
  pageage: Page;
}>({
  page: async ({ page }, use) => {
    await page.goto(tabsData.VariableDefinitions.route);
    await expect(page).toHaveURL(/\/variable-definitions$/);
    await use(page);
  },
});

// Exclude search until we implement logic
test.describe('Variable definitions – accessibility', () => {
  test('Filters are accessible', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: statusDraft });

    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();

    await expect(checkbox).toHaveAccessibleName(statusDraft);

    await checkbox.check();

    const results = await new AxeBuilder({ page })
      .exclude('.ds-alert.infoAlert')
      .exclude('[data-axe-ignore]')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('Color contrasts are accessible', async ({ page }) => {
    await page.waitForTimeout(200); // just to stabilize
    const checkbox = page.getByRole('checkbox', { name: workAndPay });

    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();

    await expect(checkbox).toHaveAccessibleName(workAndPay);

    await checkbox.check();
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .exclude('.ds-alert.infoAlert')
      .exclude('[data-axe-ignore]')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('Filters apply to landmark rules', async ({ page }) => {
    await page.waitForTimeout(200); // just to stabilize
    const checkbox = page.getByRole('checkbox', { name: socialConditionsAndCrime });

    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();

    await expect(checkbox).toHaveAccessibleName(socialConditionsAndCrime);
    const results = await new AxeBuilder({ page })
      .withRules(['landmark-no-duplicate-banner'])
      .exclude('.ds-alert.infoAlert')
      .exclude('[data-axe-ignore]')
      .analyze();
    expect(results.violations).toEqual([]);
  });
  test('Follow wcag standard', async ({ page }) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Page has header one', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules('page-has-heading-one')
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('CodeSnippet meets WCAG contrast requirements', async ({ page }) => {
    const shortName = variableDefinitions[0]?.short_name;
    await page.goto(`/variable-definitions/${shortName}`);
    await expect(page.getByTestId('code-snippet')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .include('[data-testid="code-snippet"]')
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Landingpage – accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Page has header one', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withRules('page-has-heading-one').analyze();
    expect(results.violations).toEqual([]);
  });

  test('Page has correct landmarks', async ({ page }) => {
    const results = await new AxeBuilder({ page }).withRules('region').exclude('.ds-alert.infoAlert').analyze();
    expect(results.violations).toEqual([]);
  });

  test('Color contrasts are accessible', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: localization.info.landingPageInfoIntroTitle }).click();
    await page.getByText(localization.info.landingPageInfoIntro).waitFor();
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  // When wcag AAA is required add 'wcag21aaa'
  test('Page follows wcag standard', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Landingpage navigation', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).include('nav#menu').exclude('.ds-alert.infoAlert').analyze();

    expect(results.violations).toEqual([]);
  });
});
