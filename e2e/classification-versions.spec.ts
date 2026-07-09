import { localization } from '@/libs/language';
import { expect, test, VERSION_URL, VERSIONS_VERSION_URL } from './fixtures/classificationsVersions.fixture';

test('renders versions', async ({ versionsPage }) => {
    await expect(versionsPage.getByRole('table')).toBeVisible();
  });

test('renders version versions', async ({ versionsVersionPage }) => {
    await expect(versionsVersionPage.getByRole('table')).toBeVisible();
  });