import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import classificationMock from '@/static-data/classifications.json';
import versionsMock from '@/static-data/versions.json';
import { parseClassification } from '@/utils/mock-data';
import { expect, test } from './fixtures/classification.fixture';
import { CODES_PREV_VERSION_URL, CODES_PREV_VERSION_URL_CODES, switchLanguage } from './utils/commonUtils';
import { languageButton } from './utils/variables';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

const classifications = classificationMock.classifications;
const versions = versionsMock.versions;

test('Classifications details page have title', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[1]);
  const page = await classificationDetailsPage(classification.id!);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(classification.name!);
});

test('Outdated versions display alert', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  await page.goto(CODES_PREV_VERSION_URL);
  const alert = page.getByText(localization.versions.isNotValid);
  await expect(alert).toBeVisible();
});

test('Classifications details version have title', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  const currentVersion = classification.versions!.find((version) => version.id === 1)!;
  const heading = page.getByRole('heading', { level: 2, name: currentVersion.name! });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(currentVersion.name!);
  const currentVersionDetails = versions.find((version) => version.id === currentVersion.id);
  await expect(page.getByText(currentVersionDetails?.introduction!)).toBeVisible();
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
    const tab = page.getByRole('tab', { name: localization.classificationDetails.details });
    await expect(tab).toBeVisible();
  });
  test('Changes tab is visible', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[3]);
    const page = await classificationDetailsPage(classification.id!);
    const tab = page.getByRole('tab', { name: localization.classificationDetails.changes });
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

test.describe('Version picker on classification page', () => {
  const classification = classifications[0] as unknown as ClassificationResource;
  const currentVersion = classification.versions!.find((version) => version.id === 1)!;
  const olderVersion = classification.versions!.find((version) => version.id === 2)!;
  const futureVersion = classification.versions!.find((version) => version.id === 3)!;

  test('renders the all versions section title', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await expect(page.getByText(localization.classificationDetails.versions)).toBeVisible();
  });

  test('renders version links when expanded', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.getByText(localization.classificationDetails.versions).click();
    await expect(page.getByRole('link', { name: futureVersion.name! })).toBeVisible();
    await expect(page.getByRole('link', { name: currentVersion.name! })).toBeVisible();
    await expect(page.getByRole('link', { name: olderVersion.name! })).toBeVisible();
  });

  test('renders version links in descending valid-from order', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.getByText(localization.classificationDetails.versions).click();
    const versionLinks = page.getByRole('link').filter({
      hasText: /Oppvarmingskilde (2030|2001|1983)/,
    });

    await expect(versionLinks).toHaveText([futureVersion.name!, currentVersion.name!, olderVersion.name!]);
  });

  test('links to other versions', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await page.getByText(localization.classificationDetails.versions).click();
    const link = page.getByRole('link', { name: olderVersion!.name! });

    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(CODES_PREV_VERSION_URL_CODES);
  });

  test('future versions are available', async ({ classificationDetailsPage }) => {
    const futureVersion = versions.find((version) => version.id === 1698);
    const page = await classificationDetailsPage(91);
    await page.getByRole('button', { name: localization.classificationDetails.versions }).click();
    const link = page.locator(
      `a[href="${buildUrl({ classificationId: 91, versionId: futureVersion!.id, tab: 'codes' })}"]`,
    );

    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(buildUrl({ classificationId: 91, versionId: futureVersion!.id, tab: 'codes' }));
    const heading = page.getByRole('heading', { level: 2, name: futureVersion!.name });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(futureVersion!.name);
    const introduction = heading.locator('xpath=following-sibling::p[1]');
    await expect(introduction).toBeVisible();
    await expect(introduction).not.toHaveText(/^\s*$/);
  });
});

test.describe('Classification - fallback language', () => {
  test('fallback language display tag with fallback language set', async ({ classificationDetailsPage }) => {
    const classification = parseClassification(classifications[0]);
    const page = await classificationDetailsPage(classification.id!);
    await page.getByRole('button', { name: languageButton }).click();
    await page.getByRole('button', { name: 'English' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: classification.name! })).toHaveAttribute('lang', 'nb');
    const tag = page.locator('span.ds-tag', { hasText: 'Norwegian (Bokmål)' });
    await expect(tag).toBeVisible();
    await tag.hover();
    await expect(
      page.getByText('This classification is not available in the selected language', { exact: true }),
    ).toBeVisible();
  });
});

test('displays fallback-language tag when classification is missing in the selected language', async ({
  classificationDetailsPage,
}) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);

  await switchLanguage(page, 'English');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: classification.name! })).toHaveAttribute('lang', 'nb');

  const tag = page.locator('span.ds-tag', { hasText: 'Norwegian (Bokmål)' });
  await expect(tag).toBeVisible();

  await tag.hover();
  await expect(
    page.getByText('This classification is not available in the selected language', { exact: true }),
  ).toBeVisible();
});

const contentMissingNNLanguageAlert = 'Denne klassifikasjonen manglar innhald på valt språk, vel eit anna språk.';

test('display alert content is missing in selected language - latest version', async ({
  classificationDetailsPage,
}) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);

  await switchLanguage(page, 'Norsk nynorsk');

  await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
  await expect(page.getByText(contentMissingNNLanguageAlert, { exact: true })).toBeVisible();
});

test('display alert content is missing in selected language - older version', async ({ classificationDetailsPage }) => {
  const classification = parseClassification(classifications[0]);
  const page = await classificationDetailsPage(classification.id!);
  await page.goto(buildUrl({ classificationId: classification.id!, versionId: 2, tab: 'codes' }));

  await switchLanguage(page, 'Norsk nynorsk');

  await expect(page.locator('html')).toHaveAttribute('lang', 'nn');
  await expect(page.getByText(contentMissingNNLanguageAlert, { exact: true })).toBeVisible();
});

test.describe('Classification - information Klass moved', () => {
  const classification = parseClassification(classifications[0]);

  test('alert has message', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await expect(page.getByRole('status')).toContainText(localization.migrationClassifications.info);
  });

  test('alert has heading', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await expect(page.getByRole('status')).toContainText(localization.migrationClassifications.header);
  });

  test('alert can be closed', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classification.id!);
    await expect(page.getByRole('status')).toBeVisible();
    await page.getByRole('button', { name: localization.close, exact: true }).click();
    await expect(page.getByRole('status')).not.toBeVisible();
  });
});
