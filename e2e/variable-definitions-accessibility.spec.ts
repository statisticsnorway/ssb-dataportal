import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures/variableDefinitions.fixture';
import variableDefinitions from '@/static-data/variable-definitions.json';
import { statuses, variables } from './utils/variables';
import { checkCheckbox } from './utils/commonUtils';

// Exclude search until we implement logic
test.describe('Variable definitions – accessibility', () => {
  test('Filters are accessible', async ({ variableDefinitionsPage }) => {
    const checkbox = variableDefinitionsPage.getByRole('checkbox', { name: statuses.draft.label });
    await checkCheckbox(checkbox);

    const results = await new AxeBuilder({ page: variableDefinitionsPage })
      .exclude('.ds-alert.infoAlert')
      .exclude('[data-axe-ignore]')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('Color contrasts are accessible', async ({ variableDefinitionsPage }) => {
    const checkbox = variableDefinitionsPage.getByRole('checkbox', { name: variables.workAndPay });
    await checkCheckbox(checkbox);

    const results = await new AxeBuilder({ page: variableDefinitionsPage })
      .withRules(['color-contrast'])
      .exclude('.ds-alert.infoAlert')
      .exclude('[data-axe-ignore]')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('Filters apply to landmark rules', async ({ variableDefinitionsPage }) => {
    const checkbox = variableDefinitionsPage.getByRole('checkbox', { name: variables.socialConditionsAndCrime });
    await checkCheckbox(checkbox);
    const results = await new AxeBuilder({ page: variableDefinitionsPage })
      .withRules(['landmark-no-duplicate-banner'])
      .exclude('.ds-alert.infoAlert')
      .exclude('[data-axe-ignore]')
      .analyze();
    expect(results.violations).toEqual([]);
  });
  test('Follow wcag standard', async ({ variableDefinitionsPage }) => {
    const results = await new AxeBuilder({ page: variableDefinitionsPage }).withTags(['wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Page has header one', async ({ variableDefinitionsPage }) => {
    const results = await new AxeBuilder({ page: variableDefinitionsPage })
      .withRules('page-has-heading-one')
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('CodeSnippet meets WCAG contrast requirements', async ({ variableDefinitionsPage }) => {
    const shortName = variableDefinitions[0]?.short_name;
    await variableDefinitionsPage.goto(`/variable-definitions/${shortName}`);
    await expect(variableDefinitionsPage.getByTestId('code-snippet')).toBeVisible();
    const results = await new AxeBuilder({ page: variableDefinitionsPage })
      .withRules(['color-contrast'])
      .include('[data-testid="code-snippet"]')
      .exclude('.ds-alert.infoAlert')
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
