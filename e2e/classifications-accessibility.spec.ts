import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures/classifications.fixture';

test.describe('Classifications – accessibility', () => {
  test('Page has header one', async ({ classificationsPage }) => {
    const results = await new AxeBuilder({ page: classificationsPage }).withRules('page-has-heading-one').analyze();
    expect(results.violations).toEqual([]);
  });

  test('Page has correct landmarks', async ({ classificationsPage }) => {
    const results = await new AxeBuilder({ page: classificationsPage })
      .withRules('region')
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('Color contrasts are accessible', async ({ classificationsPage }) => {
    const results = await new AxeBuilder({ page: classificationsPage })
      .withRules(['color-contrast'])
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('Page follows wcag standard', async ({ classificationsPage }) => {
    const results = await new AxeBuilder({ page: classificationsPage }).withTags(['wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });
});
