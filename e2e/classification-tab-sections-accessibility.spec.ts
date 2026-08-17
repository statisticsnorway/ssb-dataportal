import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@bgotink/playwright-coverage';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === 'chrome-unauth');
});

test('Codes tab follows wcag standard', async ({ page }) => {
  await page.goto(buildUrl({ classificationId: 2003, tab: 'codes' }));
  const results = await new AxeBuilder({ page }).withTags(['wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('About tab follows wcag standard', async ({ page }) => {
  await page.goto(`/classifications/91/about`);
  const results = await new AxeBuilder({ page }).withTags(['wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});
