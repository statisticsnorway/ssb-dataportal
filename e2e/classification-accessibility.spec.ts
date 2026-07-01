import { parseClassification } from '@/utils/classifications/classificationHelpers';
import { expect, test } from './fixtures/classification.fixture';
import classificationMock from '@/static-data/classifications.json';
import AxeBuilder from '@axe-core/playwright';

const classifications = classificationMock.classifications;


test('Classifications details page follow wcag standard', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const results = await new AxeBuilder({ page }).withRules('page-has-heading-one').analyze();
    expect(results.violations).toEqual([]);
});
