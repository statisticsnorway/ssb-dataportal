import { expect } from '@bgotink/playwright-coverage';
import { Locator, Page } from '@playwright/test';

export async function checkCheckbox(checkboxLocator: Locator) {
  await expect(checkboxLocator).toBeVisible();
  await expect(checkboxLocator).toBeEnabled();
  await checkboxLocator.check();
  await expect(checkboxLocator).toBeChecked();
}

export async function stabilize(ms = 200) {
  await new Promise((r) => setTimeout(r, ms));
}

export async function expectButtonVisible(page: Page, roleName: string) {
  const button = page.getByRole('button', { name: roleName });
  await expect(button).toBeVisible();
  return button;
}

export const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('nb-NO');
};

// Classification 2003 is the first entry in the static mock data (codes-mock.json).
// Both routes below use static data in the test environment (KLASS_USE_STATIC_DATA=true).
export const MOCK_CLASSIFICATION_ID = '2003';
export const MOCK_VERSION_ID = '1';

export const CODES_URL = `/classifications/${MOCK_CLASSIFICATION_ID}/codes`;
export const CODES_VERSION_URL = `/classifications/${MOCK_CLASSIFICATION_ID}/version/${MOCK_VERSION_ID}/codes`;
