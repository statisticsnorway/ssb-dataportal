import variableDefinitions from '@/static-data/variable-definitions.json';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@bgotink/playwright-coverage';
import { TestInfo } from '@playwright/test';
import { stabilize } from './utils/commonUtils';
import { tabsData } from '@/app/(services)/tabs';

const short_name = variableDefinitions[0]?.short_name;

test.describe('Variable definition – accessibility', () => {
  test.beforeEach(async ({ page }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await page.goto(`${tabsData.VariableDefinitions.route}/${short_name}`);
    stabilize();
  });

  test('Page is accessible', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('CodeSnippet meets WCAG contrast requirements', async ({ page }) => {
    test.skip();
    const shortName = variableDefinitions[0]?.short_name;
    await page.goto(`/variable-definitions/${shortName}`);
    await expect(page.getByTestId('code-snippet')).toBeVisible();
    const results = await new AxeBuilder({ page: page })
      .withRules(['color-contrast'])
      .include('[data-testid="code-snippet"]')
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
