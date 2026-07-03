import { localization } from '@/libs/language/src/localization';
import { ClassificationFixture, expect, test } from './fixtures/classification.fixture';
import classificationsMock from '@/static-data/classifications.json';
import { parseClassification } from '@/utils/classifications/classificationHelpers';

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

  // Open dialog
  const subscribeButton = page.getByRole('button', { name: localization.classification.subscribe });
  await expect(subscribeButton).toBeVisible();
  await subscribeButton.click();

  // Dialog is visible with expected elements
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeAttached();
  await expect(dialog.getByRole('button', { name: localization.classification.subscribeConfirm })).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: localization.classification.subscription })).toBeVisible();

  const closeButton = dialog.getByRole('button', { name: 'Lukk dialogvindu' });
  await expect(closeButton).toBeVisible();

  // Close dialog
  await closeButton.click();
  await expect(dialog).toBeHidden();
});

/*
These are subscribers
  {
    "email": "tull@ssb.no",
    "classificationId": 3
  },
  {
    "email": "statisk@ssb.no",
    "classificationId": 747
  }
*/
test.describe('User wants to start new subscription', () => {
  let page: ClassificationFixture;

  test.beforeEach(async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[0]);
    page = await classificationDetailsPage(classification.id!);
    const subscribeButton = page.getByRole('button', { name: localization.classification.subscribe });
    await expect(subscribeButton).toBeVisible();
    await subscribeButton.click();
  });
  test('User writes invalid email', async () => {
    const inputField = page
      .getByRole('dialog')
      .getByRole('textbox', { name: localization.classification.subscription });
    await inputField.fill('svada</>');
    await inputField.press('Enter');
    await page.getByRole('button', { name: localization.classification.subscribeConfirm }).click();
    await expect(page.getByRole('dialog').getByRole('alert')).toHaveText(
      localization.classification.subscribeMessageInvalidEmail,
    );
  });
  test('User writes valid email', async () => {
    const inputField = page
      .getByRole('dialog')
      .getByRole('textbox', { name: localization.classification.subscription });
    await inputField.fill('valid@example.com');
    await inputField.press('Enter');
    await page.getByRole('button', { name: localization.classification.subscribeConfirm }).click();
    await expect(page.getByRole('dialog').getByRole('alert')).toHaveText(localization.classification.subscribeMessage);
  });
});
