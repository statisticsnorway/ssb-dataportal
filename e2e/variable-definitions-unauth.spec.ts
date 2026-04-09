import { test, expect } from './fixtures/unauth.fixture';
import { tabsData } from '@/app/(services)/tabs';
import { localization } from '@/libs/language';
import { stabilize } from './utils/commonUtils';
import { statuses } from './utils/variables';

test.describe('unauthenticated variable definitions list', () => {
  test('shows only externally published variables', async ({ unauthPage }) => {
    await unauthPage.goto(tabsData.VariableDefinitions.route);
    await stabilize();
    const main = unauthPage.getByRole('main');
    await expect(main).toContainText(statuses.external.totalHits);
  });

  test('does not show status filter panel', async ({ unauthPage }) => {
    await unauthPage.goto(tabsData.VariableDefinitions.route);
    await stabilize();
    await expect(unauthPage.getByRole('checkbox', { name: new RegExp(localization.status.draft) })).not.toBeAttached();
    await expect(
      unauthPage.getByRole('checkbox', { name: new RegExp(localization.status.publishedInternal) }),
    ).not.toBeAttached();
    await expect(
      unauthPage.getByRole('checkbox', { name: new RegExp(localization.status.publishedExternal) }),
    ).not.toBeAttached();
  });
});
