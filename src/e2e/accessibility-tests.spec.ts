import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Variable definitions – accessibility', () => {
  test('filters are accessible', async ({ page }) => {
    await page.goto('/variable-definitions');

    await page.getByRole('checkbox', { name: 'Sosiale forhold og' }).check();

    const results = await new AxeBuilder({ page })
      .exclude('.ds-alert.infoAlert')
      .exclude('.search-layout_searchLabel__lAQ7Q')
      .exclude('#searchValue')
      .exclude('.search-layout_tabsNavigationContainer__1TNsL')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('color contrasts are accessible', async ({ page }) => {
    await page.goto('/variable-definitions');

    await page.getByRole('checkbox', { name: 'Sosiale forhold og' }).check();

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .exclude('.ds-alert.infoAlert')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('filters apply to landmark rules', async ({ page }) => {
    await page.goto('/variable-definitions');

    await page.getByRole('checkbox', { name: 'Sosiale forhold og' }).check();

    const results = await new AxeBuilder({ page })
      .withRules(['landmark-no-duplicate-banner'])
      .exclude('.ds-alert.infoAlert')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test('Accessibility test with impact filter in config', async ({ page }) => {
  await page.goto('/variable-definitions');

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  console.log(JSON.stringify(results.violations, null, 2));
});

test('Page has header one', async ({ page }) => {
  await page.goto('/variable-definitions');

  const results = await new AxeBuilder({ page })
    .withRules('page-has-heading-one')
    .exclude('.ds-alert.infoAlert')
    .analyze();

  expect(results.violations).toEqual([]);
});
