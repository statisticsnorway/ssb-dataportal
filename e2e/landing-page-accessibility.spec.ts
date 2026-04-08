import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures/landingPage.fixture';

test.describe('Landingpage – accessibility', () => {
  test('Page has header one', async ({ landingPage }) => {
    const results = await new AxeBuilder({ page: landingPage }).withRules('page-has-heading-one').analyze();
    expect(results.violations).toEqual([]);
  });

  test('Page has correct landmarks', async ({ landingPage }) => {
    const results = await new AxeBuilder({ page: landingPage })
      .withRules('region')
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('Color contrasts are accessible', async ({ landingPage }) => {
    const results = await new AxeBuilder({ page: landingPage })
      .withRules(['color-contrast'])
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  // When wcag AAA is required add 'wcag21aaa'
  test('Page follows wcag standard', async ({ landingPage }) => {
    const results = await new AxeBuilder({ page: landingPage }).withTags(['wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Landingpage navigation', async ({ landingPage }) => {
    const results = await new AxeBuilder({ page: landingPage })
      .include('nav#menu')
      .exclude('.ds-alert.infoAlert')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
