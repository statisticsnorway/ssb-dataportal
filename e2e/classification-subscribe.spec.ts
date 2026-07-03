import { localization } from '@/libs/language/src/localization';
import { expect, test } from './fixtures/classification.fixture';
import classificationsMock from '@/static-data/classifications.json';
import { parseClassification, stripTitlePrefix } from '@/utils/classifications/classificationHelpers';

const classifications = classificationsMock.classifications;

// Has button
// User wants to start new subscribtion
// User writes invalid email and user writes valid email and null email
// user retries after signing up in same session
// user retries after revisting explorer page
// User is already subscriber

test('Page has subscription dialog', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  const subscribeButton = page.getByRole('button', { name: localization.classification.subscribe });
  await expect(subscribeButton).toBeVisible();
  subscribeButton.click();
  await expect(page.getByRole('dialog')).toBeAttached();
});
test.describe('User wants to start new subscription', () => {
  test('User writes invalid email', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[0]);
    const page = await classificationDetailsPage(classification.id!);
    const subscribeButton = page.getByRole('button', { name: localization.classification.subscribe });
    await expect(subscribeButton).toBeVisible();
  });
});
