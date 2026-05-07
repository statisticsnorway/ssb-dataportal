import { test, expect } from './fixtures/unauth.fixture';
import { localization } from '@/libs/language';
import { DETAIL_URL } from './utils/variables';

test.describe('unauthenticated view', () => {
  test('hides code snippet', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    await expect(unauthPage.getByTestId('code-snippet')).not.toBeAttached();
  });

  test('contains sensitive information field', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    const sensitiveField = unauthPage.locator('dt', {
      hasText: localization.variableDefinition.externalPersonalData,
    });
    await expect(sensitiveField).toBeAttached();
    await expect(
      unauthPage.locator('dt', { hasText: localization.variableDefinition.internalPersonalData }),
    ).not.toBeAttached();
  });

  test('hides Owner panel', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    await expect(
      unauthPage.getByRole('definition').filter({
        hasText: localization.owner.daplaTeam,
      }),
    ).not.toBeAttached();
  });

  test('hides StatusTag', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    await expect(unauthPage.locator('main').getByText(localization.status.draft)).not.toBeAttached();
  });

  test('hides ID', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    const dl = unauthPage.locator('dl');
    await expect(dl.getByText(localization.variableDefinition.id, { exact: true })).not.toBeAttached();
  });

  test('shows only "Updated on", hides three auth-only audit fields', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    const details = unauthPage.locator('dt');
    await expect(details.getByText(`${localization.editing.updated} ${localization.on}`)).toBeVisible();
    await expect(details.getByText(`${localization.editing.updated} ${localization.by}`)).not.toBeAttached();
    await expect(details.getByText(`${localization.editing.created} ${localization.on}`)).not.toBeAttached();
    await expect(details.getByText(`${localization.editing.created} ${localization.by}`)).not.toBeAttached();
  });

  test('public content still visible', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    await expect(unauthPage.getByTestId('vardefBreadcrumbs')).toBeVisible();
    await expect(unauthPage.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
