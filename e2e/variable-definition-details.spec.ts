import { tabsData } from '@/app/(services)/tabs';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { test, expect } from '@bgotink/playwright-coverage';
import { Page } from '@playwright/test';
import { DETAIL_URL, KNOWN_SHORT_NAME } from './utils/variables';
import { localization } from '@/libs/language';
import { RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import { formatDate } from '@/utils/functions';

const variable_org = variableDefinitionsJson.map(RenderedViewFromJSON).find((v) => v.short_name === KNOWN_SHORT_NAME);

const goToDetail = async (page: Page) => {
  await page.goto(DETAIL_URL);
  await expect(page).toHaveURL(`${tabsData.VariableDefinitions.route}/${KNOWN_SHORT_NAME}`);
};

test.describe('Heading and short name', () => {
  test.beforeEach(async ({ page }) => {
    await goToDetail(page);
  });
  test('Heading displays name', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText(variable_org!.name!);
  });

  test('Short name can copy value', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'firefox');
    await page
      .getByLabel(`${localization.variableDefinition.shortName}`, { exact: true })
      .getByText(KNOWN_SHORT_NAME)
      .click();
    await expect(
      page.getByLabel(`${localization.variableDefinition.shortName}`, { exact: true }).locator('span'),
    ).toContainText(KNOWN_SHORT_NAME);

    const copyButton = page.getByRole('button', { name: `${localization.copy.shortName}` });

    await expect(copyButton).toBeAttached();
    await copyButton.click();

    const tooltip = page.locator('.ds-tooltip', { hasText: `${localization.copy.copied}` });

    // Text copied
    await expect(tooltip).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(KNOWN_SHORT_NAME);

    // Reset text
    await expect(copyButton).toBeVisible();
  });
});

test.describe('Definition and comment', () => {
  test.beforeEach(async ({ page }) => {
    await goToDetail(page);
  });
  test('Display definition', async ({ page }) => {
    await expect(page.getByRole('main')).toContainText(variable_org!.definition!);
  });

  test('Display comment', async ({ page }) => {
    const comment = page.getByText(`${localization.variableDefinition.comment}`);
    await comment.click();
    await expect(page.getByRole('main')).toContainText(variable_org!.comment!);
  });
});

const expectedAboutVariable = [
  {
    title: localization.validity.validFrom,
    values: [formatDate(variable_org!.valid_from!)],
  },
  {
    title: localization.validity.validTo,
    values: [formatDate(variable_org!.valid_until!)],
  },
  {
    title: localization.unitTypes,
    values: variable_org!.unit_types.map((v) => v.title!),
  },
  {
    title: localization.subjectFields,
    values: variable_org!.subject_fields.map((v) => v.title!),
  },
  {
    title: localization.classification.label,
    values: [variable_org!.classification_uri!],
  },
];

test.describe('About variable', () => {
  test.beforeEach(async ({ page }) => {
    await goToDetail(page);
  });

  for (const section of expectedAboutVariable) {
    test(`Displays ${section.title}`, async ({ page }) => {
      const dl = page.locator('dl');

      await expect(dl.getByText(section.title, { exact: true })).toBeVisible();

      for (const value of section.values) {
        await expect(dl.locator('dd').getByText(value, { exact: true })).toBeVisible();
      }
    });
  }
});

test.describe('ID', () => {
  test('Display ID internal', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await goToDetail(page);
    const dl = page.locator('dl');

    await expect(dl.getByText(localization.variableDefinition.id, { exact: true })).toBeVisible();
    await expect(dl.locator('dd').getByText(variable_org!.id!, { exact: true })).toBeVisible();
  });
});

const expectedContact = [
  {
    title: localization.variableDefinition.mail,
    values: [variable_org!.contact?.email!],
  },
  {
    title: `${localization.editing.updated} ${localization.on}`,
    values: [formatDate(variable_org!.last_updated_at)],
  },
  {
    title: `${localization.editing.created} ${localization.on}`,
    values: [formatDate(variable_org!.created_at)],
  },
  {
    title: `${localization.editing.updated} ${localization.by}`,
    values: [variable_org!.last_updated_by],
  },
  {
    title: `${localization.editing.created} ${localization.by}`,
    values: [variable_org!.created_by],
  },
];

test.describe('Contact', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chrome-unauth');
    await goToDetail(page);
  });

  for (const section of expectedContact) {
    test(`Displays ${section.title}`, async ({ page }) => {
      const dl = page.locator('dl');

      await expect(dl.getByText(section.title, { exact: true })).toBeVisible();

      for (const value of section.values) {
        await expect(dl.locator('dd').getByText(value, { exact: true })).toBeVisible();
      }
    });
  }

  test('Display owner', async ({ page }) => {
    await goToDetail(page);
    const owner_team = page.getByRole('definition').filter({
      hasText: localization.owner.daplaTeam,
    });

    const owner_groups = page.getByRole('definition').filter({
      hasText: localization.owner.groups,
    });

    await expect(owner_team).toContainText(variable_org!.owner.team!);
    await expect(owner_groups).toContainText(variable_org!.owner.groups!);
  });

  test('Vardef API documentation link points to the internal test docs URL when authenticated', async ({
    page,
  }) => {
    await goToDetail(page);
    const apiLink = page.getByRole('link', { name: `${localization.apiDocumentation} ${localization.apiDocVardef}` });
    await expect(apiLink).toHaveAttribute(
      'href',
      'https://metadata.test.ssb.no/docs/swagger/variable-definitions?urls.primaryName=internal',
    );
  });
});
