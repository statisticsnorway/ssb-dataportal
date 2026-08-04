import { localization } from '@/libs/language/src/localization';
import { ClassificationFixture, expect, test } from './fixtures/classification.fixture';
import classificationsMock from '@/static-data/classifications.json';
import { stripTitlePrefix } from '@/utils/classifications/classificationHelpers';
import { Locator } from '@playwright/test';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { parseClassification } from '@/utils/mock-data';

const classifications = classificationsMock.classifications;

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

test.describe('User wants to start new subscription', () => {
  let page: ClassificationFixture;
  let dialog: Locator;
  let inputField: Locator;
  let confirmSubscription: Locator;
  let classification: ClassificationResource;
  let subscriptionButton: Locator;

  test.beforeEach(async ({ classificationDetailsPage }) => {
    classification = parseClassification(classifications[0]);
    page = await classificationDetailsPage(classification.id!);
    subscriptionButton = page.getByRole('button', { name: localization.classification.subscribe });
    await expect(subscriptionButton).toBeVisible();
    await subscriptionButton.click();
    dialog = page.getByRole('dialog');
    inputField = dialog.getByRole('textbox', { name: localization.classification.subscription });
    confirmSubscription = dialog.getByRole('button', { name: localization.classification.subscribeConfirm });
  });
  test('User writes invalid email', async () => {
    await inputField.fill('svada</>');
    await expect(confirmSubscription).toBeVisible();
    await confirmSubscription.click();
    await expect(dialog.getByRole('alert')).toHaveText(localization.classification.subscribeMessageInvalidEmail);
  });
  test('User writes valid email', async () => {
    await inputField.fill('valid@example.com');
    await expect(confirmSubscription).toBeVisible();
    await confirmSubscription.click();
    await expect(dialog.getByRole('alert')).toHaveText(localization.classification.subscribeMessageSuccess);
  });
  test('User writes no email', async () => {
    await inputField.fill('');
    await expect(confirmSubscription).toBeVisible();
    await confirmSubscription.click();
    await expect(dialog.getByRole('alert')).toHaveText(localization.classification.subscribeMessageInvalidEmail);
  });
  test('User retries after valid subscription submit', async () => {
    await inputField.fill('valid@example.com');
    await expect(confirmSubscription).toBeVisible();
    await confirmSubscription.click();
    await dialog.getByRole('button', { name: 'Lukk dialogvindu' }).click();
    await page.getByRole('button', { name: localization.classification.subscribe }).click();
    await expect(confirmSubscription).not.toBeVisible();
  });
  test('User retries after valid subscription submit after revisiting explorer page', async () => {
    await inputField.fill('valid@example.com');
    await expect(confirmSubscription).toBeVisible();
    await confirmSubscription.click();
    await dialog.getByRole('button', { name: 'Lukk dialogvindu' }).click();
    const linkHome = page.getByLabel('Du er her:').getByRole('link', { name: 'Klassifikasjoner' });
    await linkHome.click();
    await page.waitForURL('**/classifications**');
    const link = page.getByRole('link', { name: stripTitlePrefix(classification.name!), exact: true }).first();
    await link.click();
    await page.waitForURL(`**/${classification.id}**`);

    // Re-query locators after navigation
    const newSubscriptionButton = page.getByRole('button', { name: localization.classification.subscribe });
    await newSubscriptionButton.click();
    const newDialog = page.getByRole('dialog');
    const newConfirmSubscription = newDialog.getByRole('button', {
      name: localization.classification.subscribeConfirm,
    });
    await expect(newConfirmSubscription).toBeVisible();
  });
});

test('User already subscribes', async ({ classificationDetailsPage }) => {
  const classificationAlreadySubscribes = parseClassification(classifications[4]);
  const pageAlreadySubscribes = await classificationDetailsPage(classificationAlreadySubscribes.id!);
  await pageAlreadySubscribes.getByRole('button', { name: localization.classification.subscribe }).click();
  const dialogAlreadySubscribes = pageAlreadySubscribes.getByRole('dialog');
  const inputFieldAlreadySubscribes = dialogAlreadySubscribes.getByRole('textbox', {
    name: localization.classification.subscription,
  });
  const confirmSubscriptionAlreadySubscribes = dialogAlreadySubscribes.getByRole('button', {
    name: localization.classification.subscribeConfirm,
  });
  await inputFieldAlreadySubscribes.fill('tull@ssb.no');
  await expect(confirmSubscriptionAlreadySubscribes).toBeVisible();
  await confirmSubscriptionAlreadySubscribes.click();
  await expect(dialogAlreadySubscribes.getByRole('alert')).toHaveText(
    localization.classification.subscribeMessageAlready,
  );
});
