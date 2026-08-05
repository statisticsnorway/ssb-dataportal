import { expect, test } from './fixtures/classification.fixture';
import { classificationDetailsTabsData } from '@/app/(details)/classifications/[id]/tabs';
import versionsMock from '@/static-data/versions.json';
import { localization } from '@/libs/language';
import { CODES_PREV_VERSION_URL, formatDate } from './utils/commonUtils';
import { formatLanguages } from '@/app/(details)/classifications/utils/about';

const versions = versionsMock.versions;
const currentVersion = versions![0];
const olderVersion = versions![1];

test.describe('Current version about tab', () => {
  test('displays version heading and introduction', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    const aboutTab = page.getByRole('tab', { name: classificationDetailsTabsData.About.label });
    await expect(aboutTab).toBeVisible();
    await aboutTab.click();
    await expect(aboutTab).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/classifications\/2003\/about/);
    const aboutSection = page.getByLabel(localization.classificationDetails.about);
    await expect(aboutSection.getByRole('heading', { name: currentVersion!.name })).toBeVisible();
    await expect(aboutSection.locator('p').first()).toHaveText(currentVersion!.introduction!);
  });

  test('displays version details', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    const aboutTab = page.getByRole('tab', { name: classificationDetailsTabsData.About.label });
    await expect(aboutTab).toBeVisible();
    await aboutTab.click();
    await expect(page.getByText(localization.classification.about.mail)).toBeVisible();

    const dl = page.locator('dl');

    await expect(dl.getByText(localization.classification.about.mail, { exact: true })).toBeVisible();
    await expect(dl.locator('dd').getByText(currentVersion!.contactPerson!.email!, { exact: true })).toBeVisible();

    await expect(dl.getByText(localization.classification.about.validity, { exact: true })).toBeVisible();
    await expect(dl.locator('dd').getByText(formatDate(currentVersion!.validFrom!), { exact: true })).toBeVisible();

    await expect(dl.getByText(localization.classification.about.publishedLanguages, { exact: true })).toBeVisible();
    await expect(
      dl.locator('dd').getByText(currentVersion!.published?.map(formatLanguages).join(', ')!, { exact: true }),
    ).toBeVisible();
  });
});

/*
test.describe('Older version about tab', () => {
  test('displays version heading and introduction', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    await page.goto(CODES_PREV_VERSION_URL);

    const aboutTab = page.getByRole('tab', { name: classificationDetailsTabsData.About.label });
    await expect(aboutTab).toBeVisible();
    await aboutTab.click();
    await expect(aboutTab).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/classifications\/2003\/version\/2\/about/);
    const aboutSection = page.getByLabel(localization.classificationDetails.about);
    await expect(aboutSection.getByRole('heading', { name: olderVersion!.name })).toBeVisible();
    await expect(aboutSection.locator('p').first()).toHaveText('');
  });

  test('displays version details', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(2003);
    const aboutTab = page.getByRole('tab', { name: classificationDetailsTabsData.About.label });
    await expect(aboutTab).toBeVisible();
    await aboutTab.click();
  });
});
*/
/*
test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/classifications/282/codes');
  await page.getByRole('tab', { name: 'Om versjonen' }).click();
  await page.getByText('E-post').click();
  await page.getByText('Gyldig fra', { exact: true }).click();
  await page.getByText('Publiserte språk').click();
  await page.getByText('Nivåer').click();
  await page.getByRole('cell', { name: 'Nivå' }).click();
  await page.getByText('Endringslogg').click();
});

test('test 2', async ({ page }) => {
  await page.goto('http://localhost:3000/classifications/563/codes');
  await page.getByRole('tab', { name: 'Om versjonen' }).click();
  await expect(page.getByLabel('Om versjonen').getByRole('heading')).toContainText('Barnevernsregionar 2004');
  await expect(page.getByText('I 2004 ble Barne-, ungdoms-')).toBeVisible();
  await expect(page.getByLabel('Om versjonen')).toContainText('Dyrhaug, Tone, 330 - Seksjon for helsestatistikk');
  await expect(page.locator('div').filter({ hasText: /^Tone\.Dyrhaug@ssb\.no$/ })).toBeVisible();
  await expect(page.getByText('Bokmål, Nynorsk, Engelsk')).toBeVisible();
  await expect(page.getByLabel('Om versjonen')).toContainText('Ikke relevant');
  await expect(page.getByLabel('Om versjonen')).toContainText(
    'Lov om barneverntjenester, § 2-2, Statlige barnevernmyndigheters organisatoriske inndeling, § 2-3, Statlige barnevernmyndigheters oppgaver og myndighet og § 2-3 a, Særskilte bestemmelser for Oslo kommune - Lovdata',
  );
  await expect(page.getByLabel('Om versjonen')).toContainText('Ikke relevant');
  await page.getByText('Nivåer').click();
      await expect(page.getByLabel(localization.classificationDetails.about).getByRole('heading')).toContainText(currentVersion!.name);
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(currentVersion!.name);
    await expect(page.getByLabel(localization.classificationDetails.about).getByRole('heading', { level: 2, name: currentVersion!.name })).toBeVisible();
});*/
