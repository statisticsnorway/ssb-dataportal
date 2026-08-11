import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures/classification.fixture';

const classificationId = 91;

for (const [name, path] of [
  ['overview', `/classifications/${classificationId}/correspondences`],
  ['detail', '/correspondences/1506?returnTo=/classifications/91/correspondences'],
] as const) {
  test(`Correspondence ${name} follows WCAG 2.1`, async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classificationId);
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag21a', 'wcag21aa'])
      .withRules(['region', 'table-duplicate-name', 'th-has-data-cells'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
