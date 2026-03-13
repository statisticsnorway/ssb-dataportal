import { localization } from '@/libs/language';
import AxeBuilder from '@axe-core/playwright';
import test, { expect } from '@playwright/test';

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
