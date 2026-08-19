import { expect, test } from './fixtures/classification.fixture';
import classificationMock from '@/static-data/classifications.json';
import { parseClassification } from '@/utils/mock-data';
import AxeBuilder from '@axe-core/playwright';

const classifications = classificationMock.classifications;

test('Page has heading rank 1', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const results = await new AxeBuilder({ page }).withRules('page-has-heading-one').analyze();
  expect(results.violations).toEqual([]);
});

test('Page has correct landmarks', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[2]);
  const page = await classificationDetailsPage(classification.id!);
  const results = await new AxeBuilder({ page }).withRules('region').analyze();
  expect(results.violations).toEqual([]);
});

test('Page has accessible color contrasts', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[3]);
  const page = await classificationDetailsPage(classification.id!);
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  expect(results.violations).toEqual([]);
});

test('Page follows wcag standard', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[4]);
  const page = await classificationDetailsPage(classification.id!);
  const results = await new AxeBuilder({ page }).withTags(['wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

// test fallback language