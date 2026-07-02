import { parseClassification } from '@/utils/classifications/classificationHelpers';
import { expect, test } from './fixtures/classification.fixture';
import classificationMock from '@/static-data/classifications.json';
import { localization } from '@/libs/language/src/localization';

const classifications = classificationMock.classifications;

test('Classifications details page have title', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(classification.name!);
});

test('Classifications details version have title', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const heading = page.getByRole('heading', { level: 2 });
  await expect(heading).toBeVisible();
  // Placeholder we fetch version title
  await expect(heading).toHaveText('Versjonens navn');
});

test.describe('Classifications details tabs', () => {
  test('Codes tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.codes });
    await expect(tab).toBeVisible();
  });
  test('About tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.about });
    await expect(tab).toBeVisible();
  });
  test('Changes tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.changes });
    await expect(tab).toBeVisible();
  });
  test('All versions tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.allVersions });
    await expect(tab).toBeVisible();
  });
  test('Correspondences tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.correspondences });
    await expect(tab).toBeVisible();
  });
  test('Variants tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.variants });
    await expect(tab).toBeVisible();
  });
});
