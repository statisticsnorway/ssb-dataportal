import AxeBuilder from '@axe-core/playwright';
import test, { expect } from '@playwright/test';

test('Codes tab follows wcag standard', async ({ page }) => {
  await page.goto(`/classifications/2003/codes`);
  const results = await new AxeBuilder({ page }).withTags(['wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('About tab follows wcag standard', async ({ page }) => {
  await page.goto(`/classifications/91/about`);
  const results = await new AxeBuilder({ page }).withTags(['wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});
