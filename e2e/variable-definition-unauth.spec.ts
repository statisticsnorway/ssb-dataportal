import { test, expect } from './fixtures/unauth.fixture';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';

const KNOWN_SHORT_NAME = 'org_form';
const DETAIL_URL = `${tabsData.VariableDefinitions.route}/${KNOWN_SHORT_NAME}`;

test.describe('unauthenticated view', () => {
  test('hides Python code snippet', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    await expect(unauthPage.getByTestId('code-snippet')).not.toBeAttached();
  });

  test('hides Owner panel', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    await expect(unauthPage.getByRole('heading', { name: localization.owner.label })).not.toBeAttached();
  });

  test('hides StatusTag in sidebar', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    await expect(unauthPage.locator('aside').getByText(localization.status.draft)).not.toBeAttached();
  });

  test('shows only "Updated on", hides three auth-only audit fields', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    const sidebar = unauthPage.locator('aside');
    await expect(sidebar.getByText(`${localization.editing.updated} ${localization.on}`)).toBeVisible();
    await expect(sidebar.getByText(`${localization.editing.updated} ${localization.by}`)).not.toBeAttached();
    await expect(sidebar.getByText(`${localization.editing.created} ${localization.on}`)).not.toBeAttached();
    await expect(sidebar.getByText(`${localization.editing.created} ${localization.by}`)).not.toBeAttached();
  });

  test('public content still visible', async ({ unauthPage }) => {
    await unauthPage.goto(DETAIL_URL);
    await expect(unauthPage.getByTestId('vardefBreadcrumbs')).toBeVisible();
    await expect(unauthPage.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
